import express from "express";
import { getAssetByFilename } from "../controllers/assets.js";

const router = express.Router();

router.get("/:filename", getAssetByFilename);

export default router;
