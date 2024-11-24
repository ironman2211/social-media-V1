import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import sharp from "sharp";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const mongoURI = process.env.MONGO_URL;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;

conn.once("open", () => {
  // Initialize stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

// Compress image before storing
const compressImage = async (buffer) => {
  return sharp(buffer).jpeg({ quality: 30 }).toBuffer(); // Adjust quality as needed
};

// Configure GridFsStorage
const storage = new GridFsStorage({
  url: mongoURI,
  file: async (req, file) => {
    const compressedBuffer = await compressImage(file.buffer); // Compress the file
    return {
      filename: file.originalname,
      bucketName: "photos",
      metadata: {
        compressed: true,
      },
    };
  },
});

const upload = multer({
  storage: new multer.memoryStorage(), // Temporarily store in memory
});

// Custom upload middleware
const uploadAndCompress = async (req, res, next) => {
  try {
    const multerUpload = upload.single("picture");
    multerUpload(req, res, async (err) => {
      if (err) return res.status(400).send({ error: err.message });

      // Compress and save the file to GridFS
      const compressedBuffer = await compressImage(req.file.buffer);
      const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "photos",
      });

      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        metadata: { compressed: true },
      });

      uploadStream.end(compressedBuffer);

      uploadStream.on("finish", () => {
        req.file = { ...req.file, id: uploadStream.id }; // Pass file metadata downstream
        next();
      });

      uploadStream.on("error", (error) => {
        res.status(500).json({ error: "Failed to upload file" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during upload" });
  }
};

// Serve files from GridFS
app.get("/assets/:filename", (req, res) => {
  const filename = req.params.filename;

  if (filename.startsWith("https://") || filename.startsWith("http://")) {
    return res.redirect(filename);
  }

  const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "photos",
  });

  const downloadStream = bucket.openDownloadStreamByName(filename);
  downloadStream.on("error", () => {
    res.status(404).json({ error: "File not found" });
  });
  downloadStream.pipe(res);
});

// Routes
app.post("/auth/register", uploadAndCompress, register);
app.post("/posts", verifyToken, uploadAndCompress, createPost);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Server setup
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
