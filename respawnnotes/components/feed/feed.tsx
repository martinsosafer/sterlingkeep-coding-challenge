import PostCard from "@/components/feed/post-card"; // adjust if needed
import { getPosts } from "@/actions/posts/getPosts";
import { formatPost } from "@/lib/posts/format-posts";
import { unstable_cache } from "next/cache";

// Cache the getPosts function
const getCachedPosts = unstable_cache(
  async () => {
    return await getPosts();
  },
  ["posts-feed"], // cache key
  {
    revalidate: 60, // revalidate every 60 seconds
    tags: ["posts"],
  }
);
export default async function Feed() {
  const { posts, error, user } = await getCachedPosts();

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
              post={formatPost(post, user?.id)}
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
