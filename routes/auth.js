import express from "express";
import { login,googleLogin, register } from "../controllers/auth.js";
import { uploadAndCompress } from "../middleware/upload.js";

const router = express.Router();

router.post("/login", login);
router.post("/login/google", googleLogin);
router.post("/register", uploadAndCompress, register);

export default router;
