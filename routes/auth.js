import express from "express";
import { login,googleLogin } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/login/google", googleLogin);

export default router;
