// components/feed/getPosts.ts
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/types";

export async function getPosts(): Promise<{
  posts: Post[] | null;
  error: any;
  user: any;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
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
    .order("created_at", { ascending: false })
    .returns<Post[]>(); // Make sure Post type includes post_likes

  return { posts, error, user };
}
