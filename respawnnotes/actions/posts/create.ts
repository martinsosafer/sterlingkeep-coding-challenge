"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const content = formData.get("content") as string;

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Ensure a profile exists for the user
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      username: user.user_metadata?.full_name || "",
      avatar_url: user.user_metadata?.avatar_url || "",
    },
    { onConflict: "id" }
  );

  if (profileError) {
    throw new Error(`Failed to create/update profile: ${profileError.message}`);
  }

  // Create the post
  const { error } = await supabase.from("posts").insert({
    content,
    user_id: user.id,
  });

  if (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }

  revalidatePath("/");
}
