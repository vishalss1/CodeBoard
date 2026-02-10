import express from "express";
import { newComment, GetComment, GetAllComments, DeleteComment, UpdateComment } from "../controllers/comment.controller.js";
import authVerify from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/:comment_id", GetComment);
router.get("/", GetAllComments);

router.use(authVerify);

router.post("/", newComment);
router.put("/:comment_id", UpdateComment);
router.delete("/:comment_id", DeleteComment);

export default router;