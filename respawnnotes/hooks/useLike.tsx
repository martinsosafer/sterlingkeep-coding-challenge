import { useState } from "react";
import { togglePostLike } from "@/actions/posts/like";
import { User } from "@/types/types";

export function useLike(
  postId: string,
  initialLikeCount: number,
  initiallyLikedByUser: boolean,
  user?: User
) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likedByUser, setLikedByUser] = useState(initiallyLikedByUser);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!user) return; // Optionally show login modal
    setIsLiking(true);
    const result = await togglePostLike(postId);
    if (result.success) {
      setLikedByUser(result.liked ?? false);
      setLikeCount((prev) => prev + (result.liked ? 1 : -1));
    }
    setIsLiking(false);
  };

  return {
    likeCount,
    likedByUser,
    isLiking,
    handleLike,
  };
}
