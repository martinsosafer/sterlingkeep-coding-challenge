import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/types";

export async function getPostById(postId: string): Promise<{
  post: Post | null;
  error: any;
  user: any;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawPost, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      image_url,
      post_likes (
        id,
        user_id
      ),
      profiles:user_id (
        id,
        username,
        avatar_url
      ),
      comments (
        id,
        content,
        created_at,
        user_id,
        image_url,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      )
    `
    )
    .eq("id", postId)
    .single();

  // Transform the data to match Post Type 
  const post: Post | null = rawPost
    ? {
        ...rawPost,
        profiles: Array.isArray(rawPost.profiles)
          ? rawPost.profiles[0]
          : rawPost.profiles,
      }
    : null;

  return { post, error, user };
}
