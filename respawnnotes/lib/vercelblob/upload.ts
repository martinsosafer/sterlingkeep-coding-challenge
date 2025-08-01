import { put } from "@vercel/blob";

export const uploadImage = async (file: File) => {
  try {
    const blob = await put(`posts/${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Image upload failed");
  }
};
