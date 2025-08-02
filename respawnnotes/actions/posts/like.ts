"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function togglePostLike(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Not authenticated" };

  const userId = user.id;

  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    await supabase.from("post_likes").delete().eq("id", existingLike.id);
    revalidatePath("/");
    return { success: true, liked: false };
  } else {
    await supabase.from("post_likes").insert({
      post_id: postId,
      user_id: userId,
    });
    revalidatePath("/");
    return { success: true, liked: true };
  }
}
