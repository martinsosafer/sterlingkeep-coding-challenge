"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGitHub() {
  const supabase = await createClient();

  const redirectTo =
    `${process.env.NEXT_PUBLIC_SITE_URL}` + `/api/auth/callback`;

  console.log("→ will ask Supabase to redirect_to:", redirectTo);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo },
  });

  if (error) {
    console.error("Error signing in with GitHub:", error);
    redirect("/login?error=Could not authenticate user");
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    redirect("/login?error=Could not sign out");
  }

  redirect("/login");
}
