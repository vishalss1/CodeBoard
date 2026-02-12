import api from '../../lib/axios';
import type { Post, CreatePostRequest, UpdatePostRequest } from './posts.types';

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await api.get<{ allPosts: Post[] }>('/post');
  return response.data.allPosts;
};

export const getPost = async (postId: string): Promise<Post> => {
  const response = await api.get<{ post: Post }>(`/post/${postId}`);
  return response.data.post;
};

export const createPost = async (data: CreatePostRequest): Promise<{ post_id: string }> => {
  const response = await api.post<{ post: { post_id: string } }>('/post', data);
  return response.data.post;
};

export const updatePost = async (postId: string, data: UpdatePostRequest): Promise<{ post_id: string }> => {
  const response = await api.put<{ post: { post_id: string } }>(`/post/${postId}`, data);
  return response.data.post;
};

export const deletePost = async (postId: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/post/${postId}`);
  return response.data;
};
