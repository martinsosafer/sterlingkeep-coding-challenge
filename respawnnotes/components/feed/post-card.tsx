"use client";
import React, { useState } from "react";
import CommentForm from "./comment-form";
import { User, FormattedPost, FormattedComment } from "@/types/types";
import Image from "next/image";
import ArcadeButton from "../ui/arcade-button";

interface PostCardProps {
  post: FormattedPost;
  user?: User;
}

export default function PostCard({ post, user }: PostCardProps) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState<FormattedComment[]>(post.comments); // Changed to FormattedComment[]
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

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);

  const handleNewComment = (newComment: FormattedComment) => {
    // Changed to FormattedComment
    setComments((prev) => [...prev, newComment]);
  };

  return (
    <div className="w-full  p-2 bg-[var(--primary-darker)] h-full">
      {/* Main Post Container */}
      <div className="relative ">
        {/* Outer Pixelated Frame */}
        <div className="border-4 border-black bg-[var(--primary-light)] p-1">
          <div className="border-2 border-yellow-400 bg-[var(--primary-light)] p-4">
            {/* Header with Avatar and User Info */}
            <div className="flex items-center gap-4 mb-4">
              {/* Pixelated Avatar Frame */}
              <div className="relative">
                <div className="w-12 h-12 border-4 border-black bg-black p-0.5">
                  <div className="w-full h-full border-2 border-bg-[var(--secondary-lighter)] overflow-hidden">
                    <Image
                      src={post.author.avatar || "/placeholder.svg"}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover pixelated"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                </div>
              </div>

              {/* User Info with Timestamp */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-[var(--primary-darker)] tracking-wider">
                    {post.author.name}
                  </span>
                  <span className="font-mono text-sm text-gray-400 bg-black px-2 py-1 border border-gray-600">
                    {post.timestamp}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Content in Arcade Text Area */}
            <div className="mb-4">
              <div className="border-4 border-black bg-black p-1">
                <div className="border-2 border-green-400 bg-gray-900 p-4">
                  <div className="font-mono text-green-400 text-sm leading-relaxed">
                    <div className="text-xs text-green-600 mb-1">
                      {"> POST_CONTENT.TXT"}
                    </div>
                    <div className="text-green-400">{post.content}</div>
                    <div className="text-xs text-green-600 mt-2">
                      {"> END_OF_FILE"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pixelated Separator */}
            <div className="flex items-center gap-1 my-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-2 h-1 bg-yellow-400"></div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <ArcadeButton variant="log" className="flex items-center gap-2">
                <span className="text-red-500">♥</span>
                <span>LIKE [0]</span>
              </ArcadeButton>
              <ArcadeButton
                variant="log"
                className="flex items-center gap-2"
                onClick={loadComments}
              >
                <span className="text-blue-400">💬</span>
                <span>REPLY [{comments.length}]</span>
              </ArcadeButton>
              <ArcadeButton variant="log" className="flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                <span>SHARE</span>
              </ArcadeButton>
            </div>

            {/* Comments Section */}
            {comments.length > 0 && (
              <div className="space-y-3">
                <div className="font-mono text-md font-bold  text-yellow-400 tracking-wider">
                  {"> COMMENTS-SECTION"}
                </div>

                {displayedComments.map((comment: any) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    {/* Comment Avatar */}
                    <div className="w-8 h-8 border-2 border-black bg-black p-0.5 flex-shrink-0">
                      <div className="w-full h-full border border-purple-400 overflow-hidden">
                        <Image
                          src={comment.author.avatar || "/placeholder.svg"}
                          alt={comment.author.name}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="border-2 border-black bg-black p-1">
                        <div className="border border-purple-400 bg-gray-800 p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-purple-400">
                              {comment.author.name}
                            </span>
                            <span className="font-mono text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <p className="font-mono text-sm text-white leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(comments.length > 2 || isLoadingComments) && (
                  <ArcadeButton
                    onClick={loadComments}
                    disabled={isLoadingComments}
                    variant="post"
                    className="text-xs"
                  >
                    {isLoadingComments
                      ? "LOADING..."
                      : showAllComments
                      ? "SHOW_FEWER"
                      : `VIEW_ALL [${comments.length}]`}
                  </ArcadeButton>
                )}
              </div>
            )}

            {/* New Comment Form */}
            {user && (
              <div className="mt-4 flex items-start gap-3">
                {user?.user_metadata?.avatar_url && (
                  <div className="w-8 h-8 border-2 border-green-400 bg-black p-0.5 flex-shrink-0">
                    <div className="w-full h-full border border-cyan-400 overflow-hidden">
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="Your avatar"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>
                  </div>
                )}
                <CommentForm
                  postId={post.id}
                  onCommentAdded={handleNewComment}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
