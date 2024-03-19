import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getAllUsers
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/addComments", verifyToken, addComment);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/", verifyToken, getAllUsers);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;