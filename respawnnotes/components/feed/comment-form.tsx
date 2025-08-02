"use client";
import React from "react";
import { useCommentForm } from "@/hooks/useCommentForm";
import ArcadeButton from "../ui/arcade-button";
import Image from "next/image";

interface Author {
  name: string;
  avatar: string;
}
interface Comment {
  id: string;
  content: string;
  created_at: string;
  image_url?: string;
  author: Author;
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}) {
  const {
    content,
    setContent,
    imageFile,
    previewUrl,
    fileInputRef,
    isSubmitting,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
  } = useCommentForm(postId, onCommentAdded);

  return (
    <div className="flex-1">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
        {/* Image preview */}
        {previewUrl && (
          <div className="border-4 border-black bg-black p-1">
            <div className="border-2 border-blue-400 bg-gray-900 p-2">
              <div className="relative h-32">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-1 text-xs text-red-400 hover:underline"
              >
                REMOVE IMAGE
              </button>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 w-full">
          {/* Text input with image button */}
          <div className="flex-1">
            <div className="border-4 border-black bg-black p-1">
              <div className="border-2 border-green-400 bg-gray-900 p-2 flex items-center">
                <input
                  type="text"
                  placeholder="> WRITE_COMMENT.TXT"
                  className="flex-1 font-mono text-green-400 text-sm bg-transparent border-none focus:outline-none resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required={!imageFile}
                  disabled={isSubmitting}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <ArcadeButton
                  type="button"
                  variant="image"
                  className="text-xs px-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  🖼️
                </ArcadeButton>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-1">
            <ArcadeButton type="submit" variant="post" disabled={isSubmitting}>
              {isSubmitting ? "POSTING..." : "POST"}
            </ArcadeButton>
          </div>
        </div>
      </form>
    </div>
  );
}
