import PostCard from "@/components/feed/post-card";
import { getPostById } from "@/actions/posts/getPostById";
import { formatPost } from "@/lib/posts/format-posts";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const { post, error, user } = await getPostById(id);

  if (error || !post) {
    console.error("Error fetching post:", error);
    notFound();
  }

  try {
    const formattedPost = formatPost(post, user?.id);

    return (
      <div className="min-h-screen bg-[var(--primary-darker)] p-4">
        <div className="max-w-2xl mx-auto">
          {/* Back to feed */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-light)] border-2 border-black font-mono text-sm hover:bg-[var(--secondary-light)] transition-colors"
            >
              ← Back to Feed
            </Link>
          </div>

          <PostCard post={formattedPost} user={user || undefined} />
        </div>
      </div>
    );
  } catch (err) {
    console.error("Error formatting post:", err);
    notFound();
  }
}
