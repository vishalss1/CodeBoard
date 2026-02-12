import express from "express";
import { redirectToGithub, OAuthLogin } from "../controllers/oauth.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", redirectToGithub);
router.get("/callback", OAuthLogin);

export default router;