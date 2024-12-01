import multer from "multer";
import { compressImage } from "../utils/compressImage.js";
import mongoose from "mongoose";

const upload = multer({ storage: new multer.memoryStorage() });

export const uploadAndCompress = async (req, res, next) => {
  try {
    const multerUpload = upload.single("picture");
    multerUpload(req, res, async (err) => {
      if (err) return res.status(400).send({ error: err.message });

      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "photos",
      });

      const compressedBuffer = await compressImage(req.file.buffer);

      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        metadata: { compressed: true },
      });

      uploadStream.end(compressedBuffer);

      uploadStream.on("finish", () => {
        req.file = { ...req.file, id: uploadStream.id };
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
