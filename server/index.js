import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
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
app.use(cors());

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

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "photos", // Bucket name to save the file into
    };
  },
});

const upload = multer({ storage });

app.get("/assets/:filename", (req, res) => {
  const filename = req.params.filename;
  
  // Check if the filename starts with "https://" or "http://"
  if (filename.startsWith("https://") || filename.startsWith("http://")) {
    return res.redirect(filename); // Redirect to the URL directly
  }

  // If the filename is not an external URL, proceed with serving from GridFS
  const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "photos", // Adjust this to your bucket name
  });

  const downloadStream = bucket.openDownloadStreamByName(filename);
  downloadStream.on("error", (err) => {
    res.status(404).json({ error: "File not found" });
  });
  downloadStream.pipe(res);
});

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
