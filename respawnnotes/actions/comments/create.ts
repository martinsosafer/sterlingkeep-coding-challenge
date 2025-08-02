"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

export async function createComment(postId: string, formData: FormData) {
  const supabase = await createClient();
  const content = formData.get("content") as string;
  const imageFile = formData.get("image") as File | null;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  let imageUrl = null;
  if (imageFile?.size) {
    const blob = await put(
      `comments/${Date.now()}-${imageFile.name}`,
      imageFile,
      {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );
    imageUrl = blob.url;
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      content,
      post_id: postId,
      user_id: user.id,
      image_url: imageUrl,
    })
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      image_url,
      profiles:user_id (username, avatar_url)
    `
    )
    .single();

  if (error) throw new Error(`Failed to create comment: ${error.message}`);

  revalidatePath("/feed");

  const profile = Array.isArray(data.profiles)
    ? data.profiles[0]
    : data.profiles;

  return {
    id: data.id,
    content: data.content,
    created_at: data.created_at,
    image_url: data.image_url,
    author: {
      name: profile?.username || "Anonymous",
      avatar: profile?.avatar_url || "https://via.placeholder.com/40",
    },
  };
}
