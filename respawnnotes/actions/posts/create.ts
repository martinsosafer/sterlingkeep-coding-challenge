// actions/posts/create.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const content = (formData.get("content") as string)?.trim();
  const imageFile = formData.get("image") as File | null;

  if (!content && (!imageFile || imageFile.size === 0)) {
    return {
      success: false,
      message: "Post must include either text or an image.",
    };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "Not authenticated" };
  }

  const username =
    user.user_metadata?.full_name ||
    user.user_metadata?.user_name ||
    user.user_metadata?.preferred_username ||
    user.user_metadata?.username ||
    user.email?.split("@")[0] ||
    "New User";

  let imageUrl = null;
  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(
        `posts/${Date.now()}-${imageFile.name}`,
        imageFile,
        {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        }
      );
      imageUrl = blob.url;
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  }

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      username,
      avatar_url: user.user_metadata?.avatar_url || "",
    },
    { onConflict: "id" }
  );

  const { error } = await supabase.from("posts").insert({
    content,
    user_id: user.id,
    image_url: imageUrl,
  });

  if (error) {
    console.error("Post creation failed:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
