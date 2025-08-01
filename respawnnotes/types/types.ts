export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    username?: string;
    avatar_url?: string;
    full_name?: string;
  };
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
}
export interface Author {
  name: string;
  avatar: string;
}
export interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: Profile;
  comments?: Comment[];
  image_url?: string;
}
export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: Profile | Profile[];
  image_url?: string;
}

export interface FormattedPost {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  image_url?: string;
  comments: FormattedComment[];
}
export interface FormattedComment {
  id: string;
  content: string;
  created_at: string;
  author: {
    name: string;
    avatar: string;
  };
  image_url?: string;
}
