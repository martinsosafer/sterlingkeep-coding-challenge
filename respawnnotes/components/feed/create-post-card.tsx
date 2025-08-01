"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { createPost } from "@/actions/posts/create";
import { useFormStatus } from "react-dom";
import { User } from "@/types/types";
import ArcadeButton from "../ui/arcade-button";

interface CreatePostCardProps {
  user: User;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <ArcadeButton
      type="submit"
      variant="log"
      disabled={pending}
      className="text-green-400 text-sm"
    >
      {pending ? "POSTING..." : "POST"}
    </ArcadeButton>
  );
}

export default function CreatePostCard({ user }: CreatePostCardProps) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (imageFile) {
      formData.append("image", imageFile);
    }
    await createPost(formData);
    // State will be reset by redirect
  };

  return (
    <div className="w-full p-2 bg-[var(--primary-darker)] h-full">
      <div className="relative">
        <div className="border-4 border-black bg-[var(--primary-light)] p-1">
          <div className="border-2 border-yellow-400 bg-[var(--primary-light)] p-4">
            <form action={handleSubmit}>
              <div className="flex items-start gap-4">
                {/* Pixelated Avatar */}
                {user?.user_metadata?.avatar_url && (
                  <div className="w-12 h-12 border-4 border-black bg-black p-0.5 flex-shrink-0">
                    <div className="w-full h-full border-2 border-bg-[var(--secondary-lighter)] overflow-hidden">
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata?.full_name || "User avatar"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>
                  </div>
                )}

                {/* Textarea and Button */}
                <div className="flex-1">
                  {/* Text Input */}
                  <div className="border-4 border-black bg-black p-1">
                    <div className="border-2 border-green-400 bg-gray-900 p-2">
                      <textarea
                        name="content"
                        placeholder="> WRITE_YOUR_POST.TXT"
                        className="w-full font-mono text-green-400 text-sm leading-relaxed bg-transparent border-none focus:outline-none resize-none"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="mt-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*,image/gif"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <ArcadeButton
                      type="button"
                      variant="log"
                      className="text-blue-400 text-xs"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      🖼️ ADD IMAGE
                    </ArcadeButton>

                    {previewUrl && (
                      <div className="mt-2 border-4 border-black bg-black p-1">
                        <div className="border-2 border-yellow-400 bg-gray-900 p-2">
                          <div className="relative h-40">
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
                            className="mt-2 text-xs text-red-400 hover:underline"
                          >
                            REMOVE IMAGE
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Separator */}
                  <div className="flex items-center gap-1 my-3">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="w-2 h-1 bg-yellow-400" />
                    ))}
                  </div>

                  {/* Arcade Submit Button */}
                  <div className="flex justify-end">
                    <SubmitButton />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
