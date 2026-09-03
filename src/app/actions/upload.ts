"use server";
import { stackServerApp } from '@/stack/server';
import { put, del } from '@vercel/blob'

export type UploadedFile = {
  url: string;
  size: number;
  type: string;
  filename?: string;
};

export async function uploadFile(formData: FormData): Promise<UploadedFile> {
  // Basic validation constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const files = formData.getAll("files").filter(Boolean) as File[];
  const file = files[0];

  console.log(
    "📤 uploadFile called, received files:",
    files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
  );

  if (!file) {
    throw new Error("No file provided");
  }

  if (!ALLOWED.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  try {
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true
    })

    return {
      url: blob.url ?? "",
      size: file.size,
      type: file.type,
      filename: blob.pathname ?? file.name
    }
  } catch (error) {
    console.error('Something went wrong uploading your image')
    throw new Error('Something went wrong uploading your image')
  }
}

export async function deleteFile(url: string): Promise<void> {
  // Auth check (same pattern as your other actions)
  const user = await stackServerApp.getUser()
  if (!user) throw new Error('Unauthorized')

  await del(url)
}
