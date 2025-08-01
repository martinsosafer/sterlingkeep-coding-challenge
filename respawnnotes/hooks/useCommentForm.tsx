import { useState, useRef } from "react";
import { createComment } from "@/actions/comments/create";

export function useCommentForm(
  postId: string,
  onCommentAdded: (comment: any) => void
) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      const newComment = await createComment(postId, formData);
      onCommentAdded(newComment);
      setContent("");
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content,
    setContent,
    imageFile,
    previewUrl,
    fileInputRef,
    isSubmitting,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
  };
}
