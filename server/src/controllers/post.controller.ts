import type { Request, Response, NextFunction } from "express";
import { createPost, getPost, deletePost, updatePost, getAllPost } from "../models/post.model.js";
import AppError from "../util/AppError.js";

interface PostBody {
    title: string;
    code: string;
    language: string;
}

interface PostParams {
    post_id: string;
}

export const newPost = async (req: Request<{}, {}, PostBody>, res: Response, next: NextFunction) => {
    try {
        const { title, code, language } = req.body;
        const owner_id = req.user!.user_id;

        if(!title || !code || !language) {
            return next(new AppError("Post Details required", 400));
        }

        const post = await createPost(title, code, language, owner_id);

        res.status(201).json({ post });
    } catch(err) {
        next(err);
    }
};

export const GetPost = async (req: Request<PostParams>, res: Response, next: NextFunction) => {
    try {
        const { post_id } = req.params;
        if(!post_id) {
            return next(new AppError("Post id required", 400));
        }

        const post = await getPost(post_id);

        if(!post) {
            return next(new AppError("Post not found", 404));
        }

        res.status(200).json({ post });
    } catch(err) {
        next(err);
    }
};

export const GetAllPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allPosts = await getAllPost();

        res.status(200).json({ allPosts });
    } catch(err) {
        next(err);
    }
};

export const UpdatePost = async (req: Request<PostParams, {}, Partial<PostBody>>, res: Response, next: NextFunction) => {
    try {
        const { post_id } = req.params;
        const updates = req.body;
        const owner_id = req.user!.user_id;

        if(!post_id) {
            return next(new AppError("Post id required", 400));
        }

        if (updates.title === undefined &&
            updates.code === undefined &&
            updates.language === undefined
        ) {
            return next(new AppError("At least one field must be updated", 400));
        }

        const post = await updatePost(post_id, owner_id, updates);

        res.status(200).json({ post });
    } catch(err) {
        next(err);
    }
};

export const DeletePost = async (req: Request<PostParams>, res: Response, next: NextFunction) => {
    try {
        const { post_id } = req.params;
        const owner_id = req.user!.user_id;

        if(!post_id) {
            return next(new AppError("Post id required", 400));
        }

        const post = await deletePost(post_id, owner_id);

        if(!post) {
            return next(new AppError("Post not found", 404));
        }

        res.status(200).json({ message: "Post deleted" });
    } catch(err) {
        next(err);
    }
};