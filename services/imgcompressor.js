
import sharp from "sharp";
import multer from "multer";

import mongoose from "mongoose";
import Grid from "gridfs-stream";

const mongoURI = 'mongodb+srv://brahma:CmmSHd9fbzQ8JJ26@dbapi.itm4gcb.mongodb.net/?retryWrites=true&w=majority';
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  let gfs;
  
  conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
  });
const upload = multer({
    storage: new multer.memoryStorage(),
  });
  
const compressImage = async (buffer) => {
    return sharp(buffer).jpeg({ quality: 20 }).toBuffer();
  };
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
  
export  {uploadAndCompress};   