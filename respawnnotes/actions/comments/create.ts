"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  // Insert comment and get the full data with author info
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

  if (error) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }

  revalidatePath("/feed");

  // Return the new comment with author info
  return {
    id: data.id,
    content: data.content,
    created_at: data.created_at,
    author: {
      name: data.profiles?.username || "Anonymous",
      avatar: data.profiles?.avatar_url || "https://via.placeholder.com/40",
    },
  };
}
