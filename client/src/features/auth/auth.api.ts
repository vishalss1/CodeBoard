import api from '../../lib/axios';
import type { LoginRequest, RegisterRequest, AuthResponse, MessageResponse } from './auth.types';

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const registerUser = async (data: RegisterRequest): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>('/auth/register', data);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/refresh');
  return response.data;
};

export const getGithubLoginUrl = (): string => {
  return '/auth/github';
};
