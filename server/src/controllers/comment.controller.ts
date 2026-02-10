import type { Request, Response, NextFunction } from "express";
import { createComment, getComment, getAllComments, deleteComment, updateComment } from "../models/comment.model.js";
import AppError from "../util/AppError.js";

interface CommentBody {
    text: string;
}

interface CommentParams {
    post_id: string;
    comment_id: string;
}

export const newComment = async (req: Request<CommentParams, {}, CommentBody>, res: Response, next: NextFunction) => {
    try {
        const { post_id } = req.params;
        const user_id = req.user!.user_id;
        const { text } = req.body;

        if(!post_id || !text) {
            return next(new AppError("Comment details required", 400));
        }

        const comment = await createComment(post_id, user_id, text);

        res.status(201).json({ comment });
    } catch(err) {
        next(err);
    }
    
};

export const GetComment = async (req: Request<CommentParams>, res: Response, next: NextFunction) => {
    try {
        const { comment_id } = req.params;

        if(!comment_id) {
            return next(new AppError("Comment id required", 400));
        }

        const comment = await getComment(comment_id);

        if(!comment) {
            return next(new AppError("Comment not found", 404));
        }

        res.status(200).json({ comment });
    } catch(err) {
        next(err);
    }
};

export const GetAllComments = async (req: Request<CommentParams>, res: Response, next: NextFunction) => {
    try {
        const { post_id } = req.params;

        if(!post_id) {
            return next(new AppError("Post id required", 400));
        }

        const allComments = await getAllComments(post_id);

        res.status(200).json({ allComments });
    } catch(err) {
        next(err);
    }
};

export const DeleteComment = async (req: Request<CommentParams>, res: Response, next: NextFunction) => {
    try {
        const { comment_id } = req.params;
        const user_id = req.user!.user_id;

        if(!comment_id) {
            return next(new AppError("Comment id required", 400));
        }

        const deleted = await deleteComment(comment_id, user_id);

        if(!deleted) {
            return next(new AppError("Comment not found", 404));
        }

        res.status(200).json({ message: "Comment deleted" });
    } catch(err) {
        next(err);
    }
};

export const UpdateComment = async (req: Request<CommentParams, {}, CommentBody>, res: Response, next: NextFunction) => {
    try {
        const { text } = req.body;
        const { comment_id } = req.params;
        const user_id = req.user!.user_id;

        if(!comment_id || !text) {
            return next(new AppError("Comment details required", 400));
        }

        const comment = await updateComment(comment_id, user_id, text);

        if(!comment) {
            return next(new AppError("Comment not found", 404));
        }

        res.status(200).json({ comment });
    } catch(err) {
        next(err);
    }
};