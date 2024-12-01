import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initializeGridFS } from "./config/gridfs.js";

const PORT = process.env.PORT || 6001;

connectDB().then(() => {
  const conn = mongoose.connection;    
  initializeGridFS(conn);   
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
});
