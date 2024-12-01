import express from "express";
import { getFeedPosts, getUserPosts, likePost,deletePost,commentPost, createPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { uploadAndCompress } from "../middleware/upload.js";

const router = express.Router();


router.post("/", verifyToken, uploadAndCompress, createPost);

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);

// DELETE
router.delete("/:id", verifyToken, deletePost);

export default router;
