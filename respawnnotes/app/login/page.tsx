import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginCard from "@/components/login/login-card";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <LoginCard error={params.error} />;
}
