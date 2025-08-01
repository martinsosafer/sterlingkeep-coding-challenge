import { getUser } from "@/actions/auth/user-info";

import CreatePostCard from "@/components/feed/create-post-card";
import Feed from "@/components/feed/feed";

export default async function FeedPage() {
  const user = await getUser();

  return (
    <div
      className="
    min-h-screen 
    bg-gradient-to-b 
    from-[var(--primary-lighter)]/60 
    via-[var(--primary-lighter)]/80 
    to-white
  "
    >
      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {user && <CreatePostCard user={user} />}
          <Feed />
        </div>
      </main>
    </div>
  );
}
