import mongoose from "mongoose";

export const getAssetByFilename = (req, res) => {
  const filename = req.params.filename;

  // If filename is a URL, redirect
  if (filename.startsWith("https://") || filename.startsWith("http://")) {
    return res.redirect(filename);
  }

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "photos",
  });

  const downloadStream = bucket.openDownloadStreamByName(filename);

  downloadStream.on("error", (error) => {
    console.error("Error fetching file:", error);
    res.status(404).json({ error: "File not found" });
  });

  res.setHeader("Content-Type", "image/jpeg"); // You can set dynamic content type based on file type if needed
  downloadStream.pipe(res);
};
