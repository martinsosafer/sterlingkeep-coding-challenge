"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type CommentWithProfile = {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  }[];
};

export async function createComment(postId: string, formData: FormData) {
  const supabase = await createClient();
  const content = formData.get("content") as string;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Insert the comment and fetch joined profile info
  const { data, error } = await supabase
    .from("comments")
    .insert({
      content,
      post_id: postId,
      user_id: user.id,
    })
    .select(
      `
      id,
      content,
      created_at,
      profiles:user_id (
        username,
        avatar_url
      )
    `
    )
    .single();

  if (error || !data) {
    throw new Error(`Failed to create comment: ${error?.message}`);
  }

  const comment = data as CommentWithProfile;
  const profile = comment.profiles?.[0];

  revalidatePath("/feed");

  return {
    id: comment.id,
    content: comment.content,
    created_at: comment.created_at,
    author: {
      name: profile?.username || "Anonymous",
      avatar: profile?.avatar_url || "https://via.placeholder.com/40",
    },
  };
}
