"use client";

import MDEditor from "@uiw/react-md-editor";
import { Upload, X, Sparkles, HatGlasses, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createArticle, updateArticle } from "@/app/actions/articles";
import { deleteFile, uploadFile } from "@/app/actions/upload";
import { toast } from "@/components/ui/toast";

interface WikiEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialImageUrl?: string | null;
  isEditing?: boolean;
  articleId?: string;
}

interface FormData {
  title: string;
  content: string;
  files: File[];
}

interface FormErrors {
  title?: string;
  content?: string;
}

export default function WikiEditor({
  initialTitle = "",
  initialContent = "",
  initialImageUrl = null,
  isEditing = false,
  articleId,
}: WikiEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
    initialImageUrl ?? null,
  );
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [useAiSummary, setUseAiSummary] = useState(true);
  const [useAnonymousPost, setUseAnonymousPost] = useState(false);

  const router = useRouter();

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    const saveOperation = async () => {
      // Upload the first image file if one was selected
      let imageUrl: string | undefined;

      if (files.length > 0) {
        const formData = new FormData();
        formData.append("files", files[0]);
        const uploaded = await uploadFile(formData);
        imageUrl = uploaded.url;
      }

      if (isEditing && removeExistingImage && existingImageUrl) {
        await deleteFile(existingImageUrl);
        if (!imageUrl) {
          imageUrl = "";
        }
      }

      if (isEditing && articleId) {
        await updateArticle(articleId, {
          title: title.trim(),
          content: content.trim(),
          imageUrl,
          useAiSummary,
          isAnonymous: useAnonymousPost,
        });
        router.push(`/wiki/${articleId}`);
        return "Article updated successfully!";
      } else {
        await createArticle({
          title: title.trim(),
          content: content.trim(),
          authorId: "", // filled by the server action from the session
          imageUrl,
          useAiSummary,
          isAnonymous: useAnonymousPost,
        });
        router.push("/");
        return "Article created successfully!";
      }
    };

    const promise = saveOperation();

    toast.promise(promise, {
      loading: isEditing ? "Saving your edits..." : "Publishing new article...",
      success: (message) => message,
      error: "Failed to save the article. Please try again.",
    });

    promise.finally(() => {
      setIsSubmitting(false);
    });
  };

  const pageTitle = isEditing ? "Edit Article" : "Create New Article";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        {isEditing && articleId && (
          <p className="text-muted-foreground mt-2">
            Editing article ID: {articleId}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Section */}
        <Card>
          <CardHeader>
            <CardTitle>Article Title</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter article title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>Article Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown) *</Label>
              <div
                className={`border rounded-md ${
                  errors.content ? "border-destructive" : ""
                }`}
              >
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || "")}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  textareaProps={{
                    placeholder: "Write your article content in Markdown...",
                    style: { fontSize: 14, lineHeight: 1.5 },
                  }}
                />
              </div>
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label
                htmlFor="file-upload"
                className="block border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <div className="space-y-2">
                  <span className="text-sm font-medium block">
                    Click to upload files
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Upload images, documents, or other files to attach to your
                    article
                  </p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>

              {/* Display uploaded files */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Uploaded Files:</Label>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: the order won't change
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {file.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Attached Files */}
              {existingImageUrl && !removeExistingImage && (
                <div className="space-y-2 mt-4">
                  <Label className="text-sm font-medium">
                    Existing Attachment:
                  </Label>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md border">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className="text-sm font-medium truncate">
                        {existingImageUrl.split("/").pop()}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        (Already attached)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setRemoveExistingImage(true)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* "Image will be removed" undo banner */}
              {removeExistingImage && existingImageUrl && (
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <span className="text-sm text-destructive">
                    Image will be removed on save
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRemoveExistingImage(false)}
                  >
                    Undo
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Options card */}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          {/* AI Summary Toggle */}
          <CardContent>
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-3 transition-all duration-300 ${!useAiSummary ? "opacity-50 grayscale" : ""}`}
              >
                {/* SVG definition for the static icon gradient */}
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient
                      id="ai-editor-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <Sparkles
                  className="size-5 shrink-0"
                  style={{ stroke: "url(#ai-editor-gradient)" }}
                />
                <div>
                  <Label
                    htmlFor="ai-summary"
                    className="text-sm font-medium cursor-pointer"
                  >
                    AI Summary
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Automatically generate a concise summary of your article
                  </p>
                </div>
              </div>
              <Switch
                id="ai-summary"
                checked={useAiSummary}
                onCheckedChange={setUseAiSummary}
                className="cursor-pointer"
              />
            </div>
          </CardContent>

          {/* Anonymous article toggle */}
          <CardContent>
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-3 transition-all duration-300 ${!useAnonymousPost ? "opacity-50 grayscale" : ""}`}
              >
                <HatGlasses className="size-5 shrink-0" />
                <div>
                  <Label
                    htmlFor="anonymous-post"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Anonymous post
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Show your post as anonymous (your username will be hidden)
                  </p>
                </div>
              </div>
              <Switch
                id="anonymous-post"
                checked={useAnonymousPost}
                onCheckedChange={setUseAnonymousPost}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end space-x-2">
              <AlertDialog>
                <AlertDialogTrigger
                  disabled={isSubmitting}
                  render={
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel? Any unsaved changes will
                      be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Editing</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (isEditing && articleId) {
                          router.push(`/wiki/${articleId}`);
                        } else {
                          router.push("/");
                        }
                      }}
                    >
                      Yes, cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-25"
              >
                {isSubmitting ? "Saving..." : "Save Article"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
