"use client";
import React, { useState } from "react";
import { createComment } from "@/actions/comments/create";
import ArcadeButton from "../ui/arcade-button";

interface Author {
  name: string;
  avatar: string;
}
interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: Author;
}
export default function CommentForm({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", content);

      // Create comment and get the new comment data
      const newComment = await createComment(postId, formData);

      // Add the new comment to the UI
      onCommentAdded(newComment);
      setContent("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      // Handle error (e.g., show toast message)
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className=" flex items-start gap-3 w-full">
      {/* Avatar if needed could go here */}

      <div className="flex-1">
        {/* Outer pixelated frame */}
        <div className="border-4 border-black bg-black p-1">
          <div className="border-2 border-green-400 bg-gray-900 p-2">
            <input
              type="text"
              placeholder="> WRITE_COMMENT.TXT"
              className="w-full font-mono text-green-400 text-sm leading-relaxed bg-transparent border-none focus:outline-none resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
      <div className="mt-1">
        <ArcadeButton variant="post" disabled={isSubmitting}>
          {isSubmitting ? "POSTING..." : "POST"}
        </ArcadeButton>
      </div>
    </form>
  );
}
