import express from "express";
import { newPost, GetPost, GetAllPost, UpdatePost, DeletePost } from "../controllers/post.controller.js";
import authVerify from "../middlewares/auth.middleware.js";
import commentRouter from "./comment.routes.js";

const router = express.Router();

router.get("/:post_id", GetPost);
router.get("/", GetAllPost);

router.use("/:post_id/comment", commentRouter);
router.use(authVerify);

router.post("/", newPost);
router.put("/:post_id", UpdatePost);
router.delete("/:post_id", DeletePost);

export default router;