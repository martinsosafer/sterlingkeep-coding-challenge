"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const content = (formData.get("content") as string)?.trim();
  const imageFile = formData.get("image") as File | null;

  if (!content && (!imageFile || imageFile.size === 0)) {
    throw new Error("Post must include either text or an image.");
  }
  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Extract username with proper fallbacks
  const username =
    user.user_metadata?.full_name ||
    user.user_metadata?.user_name ||
    user.user_metadata?.preferred_username ||
    user.user_metadata?.username ||
    user.email?.split("@")[0] ||
    "New User";

  // Handle image upload
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
      // Continue without image if upload fails
    }
  }

  // Ensure a profile exists for the user
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      username,
      avatar_url: user.user_metadata?.avatar_url || "",
    },
    { onConflict: "id" }
  );

  if (profileError) {
    console.error("Profile error:", profileError.message);
  }

  // Create the post with optional image
  const { error } = await supabase.from("posts").insert({
    content,
    user_id: user.id,
    image_url: imageUrl, // Add image URL to post
  });

  if (error) {
    console.error("Post creation failed:", error.message);
    throw error;
  }

  revalidatePath("/");
  redirect("/");
}
