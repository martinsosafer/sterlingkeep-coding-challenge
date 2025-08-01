import { signInWithGitHub } from "@/actions/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Await searchParams before using it
  const params = await searchParams;

  // Check if user is already logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div>
      <div>
        <div>
          <h1>Sign in to your account</h1>
          <p>Use your GitHub account to continue</p>
        </div>

        <div>
          {params.error && <div>{params.error}</div>}

          <form action={signInWithGitHub}>
            <button type="submit">Continue with GitHub</button>
          </form>
        </div>
      </div>
    </div>
  );
}
