import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getAllUsers,
  getAllPrivateChats,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/", verifyToken, getAllUsers);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

router.post("/chats/getAll", verifyToken, getAllPrivateChats);

export default router;
