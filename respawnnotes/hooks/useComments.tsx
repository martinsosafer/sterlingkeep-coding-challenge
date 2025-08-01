import { useState } from "react";
import { FormattedComment } from "@/types/types";

export function useComments(initialComments: FormattedComment[]) {
  const [comments, setComments] = useState<FormattedComment[]>(initialComments);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const loadComments = async () => {
    if (comments.length > 0 && !showAllComments) {
      setShowAllComments(true);
      return;
    }
    setIsLoadingComments(true);
    try {
      setShowAllComments(!showAllComments);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleNewComment = (newComment: FormattedComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);

  return {
    comments,
    displayedComments,
    showAllComments,
    isLoadingComments,
    loadComments,
    handleNewComment,
  };
}
