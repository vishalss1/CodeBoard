export interface Comment {
  comment_id: string;
  post_id: string;
  user_id: string;
  text: string;
}

export interface CreateCommentRequest {
  text: string;
}

export interface UpdateCommentRequest {
  text: string;
}

export interface CommentResponse {
  comment_id: string;
  text: string;
}
