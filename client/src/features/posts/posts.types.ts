export interface Post {
  post_id: string;
  title: string;
  code: string;
  language: string;
  owner_id: string;
}

export interface CreatePostRequest {
  title: string;
  code: string;
  language: string;
}

export interface UpdatePostRequest {
  title?: string;
  code?: string;
  language?: string;
}
