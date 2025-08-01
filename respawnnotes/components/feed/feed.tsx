import PostCard from "@/components/feed/post-card"; // adjust if needed
import { getPosts } from "@/actions/posts/getPosts";
import { formatPost } from "@/lib/posts/format-posts";

export default async function Feed() {
  const { posts, error, user } = await getPosts();

  if (error) {
    console.error("Error fetching posts:", error);
    return <div className="text-red-500">Error loading posts</div>;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No posts yet. Be the first to post!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        try {
          return (
            <PostCard
              key={post.id}
              post={formatPost(post)}
              user={user || undefined}
            />
          );
        } catch (err) {
          console.error("Error formatting post:", err);
          return null;
        }
      })}
    </div>
  );
}
