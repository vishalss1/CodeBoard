import api from '../../lib/axios';
import type { Comment, CreateCommentRequest, UpdateCommentRequest, CommentResponse } from './comments.types';

export const getAllComments = async (postId: string): Promise<Comment[]> => {
  const response = await api.get<{ allComments: Comment[] }>(`/post/${postId}/comment`);
  return response.data.allComments;
};

export const createComment = async (postId: string, data: CreateCommentRequest): Promise<CommentResponse> => {
  const response = await api.post<{ comment: CommentResponse }>(`/post/${postId}/comment`, data);
  return response.data.comment;
};

export const updateComment = async (
  postId: string,
  commentId: string,
  data: UpdateCommentRequest
): Promise<CommentResponse> => {
  const response = await api.put<{ comment: CommentResponse }>(`/post/${postId}/comment/${commentId}`, data);
  return response.data.comment;
};

export const deleteComment = async (postId: string, commentId: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/post/${postId}/comment/${commentId}`);
  return response.data;
};
