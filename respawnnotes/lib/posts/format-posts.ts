import { Post, FormattedPost, FormattedComment, Profile } from "@/types/types";

export function formatPost(post: Post, currentUserId?: string): FormattedPost {
  const getProfileData = (profiles: Profile | Profile[] | undefined) => {
    if (!profiles)
      return { username: "Unknown", avatar_url: "/default-avatar.png" };
    if (Array.isArray(profiles))
      return (
        profiles[0] || {
          username: "Unknown",
          avatar_url: "/default-avatar.png",
        }
      );
    return profiles;
  };

  const authorProfile = getProfileData(post.profiles);
  const author = {
    name: authorProfile.username,
    avatar: authorProfile.avatar_url,
  };

  const comments: FormattedComment[] =
    post.comments?.map((comment) => {
      const commentProfile = getProfileData(comment.profiles);
      return {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        image_url: comment.image_url,
        author: {
          name: commentProfile.username,
          avatar: commentProfile.avatar_url,
        },
      };
    }) || [];
  // Calculate lIKES
  const likeCount = post.post_likes?.length || 0;
  const likedByUser =
    post.post_likes?.some((like) => like.user_id === currentUserId) || false;

  return {
    id: post.id,
    author,
    content: post.content,
    timestamp: new Date(post.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    image_url: post.image_url ?? undefined,
    comments,
    likeCount,
    likedByUser,
  };
}
