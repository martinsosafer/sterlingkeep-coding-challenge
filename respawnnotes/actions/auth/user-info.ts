import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (
      error &&
      ![
        "Auth session missing!",
        "JWT is missing",
        "User not found",
        "Invalid token",
      ].includes(error.message)
    ) {
      console.warn("Unexpected Supabase user error:", error.message);
    }

    return data?.user ?? null;
  } catch (err: any) {
    if (
      err?.message === "Auth session missing!" ||
      err?.message === "JWT is missing" ||
      err?.message === "User not found"
    ) {
      return null;
    }

    console.error("Unhandled exception in getUser:", err);
    return null;
  }
}
