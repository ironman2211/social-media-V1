import mongoose from "mongoose";
import Grid from "gridfs-stream";

export let gfs;

export const initializeGridFS = (connection) => {
  gfs = Grid(connection, mongoose.mongo);
  gfs.collection("photos");
};
