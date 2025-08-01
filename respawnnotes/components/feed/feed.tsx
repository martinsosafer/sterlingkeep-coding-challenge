import { createClient } from "@/lib/supabase/server";
import PostCard from "./post-card";
import { Post, FormattedPost, User, FormattedComment } from "@/types/types";

export default async function Feed() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      id, 
      content, 
      created_at,
      user_id,
      profiles:user_id (
        id,
        username,
        avatar_url
      ),
      comments (
        id,
        content,
        created_at,
        user_id,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      )
    `
    )
    .order("created_at", { ascending: false })
    .returns<Post[]>();

  if (error) {
    console.error("Error fetching posts:", error);
    return <div className="text-red-500">Error loading posts</div>;
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No posts yet. Be the first to post!
      </div>
    );
  }

  const formatPost = (post: Post): FormattedPost => {
    if (!post.profiles) {
      throw new Error("Post is missing required profile information");
    }

    const author = {
      name: post.profiles.username ?? "Unknown", // Fallback for username
      avatar: post.profiles.avatar_url ?? "/default-avatar.png", // Fallback for avatar
    };

    const comments: FormattedComment[] =
      post.comments?.map((comment) => {
        if (!comment.profiles) {
          throw new Error("Comment is missing required profile information");
        }

        return {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          author: {
            name: comment.profiles.username ?? "Unknown",
            avatar: comment.profiles.avatar_url ?? "/default-avatar.png",
          },
        };
      }) || [];

    return {
      id: post.id,
      author,
      content: post.content,
      timestamp: new Date(post.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      comments,
    };
  };

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
        } catch (error) {
          console.error("Error formatting post:", error);
          return null; // or render an error component
        }
      })}
    </div>
  );
}
