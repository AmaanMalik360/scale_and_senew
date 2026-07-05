"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ImageIcon, Plus, X, RefreshCw } from "lucide-react";

export interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

export interface ProductImageUploadProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages?: number;
}

export const ProductImageUpload = ({
  images,
  onImagesChange,
  maxImages = 10,
}: ProductImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newImages: ImageItem[] = [];
      const remainingSlots = maxImages - images.length;

      Array.from(files)
        .slice(0, remainingSlots)
        .forEach((file) => {
          if (file.type.startsWith("image/")) {
            newImages.push({
              id: generateId(),
              file,
              preview: URL.createObjectURL(file),
            });
          }
        });

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    },
    [images, maxImages, onImagesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleRemoveImage = useCallback(
    (id: string) => {
      const imageToRemove = images.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      onImagesChange(images.filter((img) => img.id !== id));
    },
    [images, onImagesChange]
  );

  const handleReplaceImage = useCallback(
    (id: string, file: File) => {
      const imageToReplace = images.find((img) => img.id === id);
      if (imageToReplace) {
        URL.revokeObjectURL(imageToReplace.preview);
      }
      onImagesChange(
        images.map((img) =>
          img.id === id
            ? { id, file, preview: URL.createObjectURL(file) }
            : img
        )
      );
    },
    [images, onImagesChange]
  );

  const mainImage = images[0];
  const thumbnailImages = images.slice(1);
  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      <label className="text-body font-medium text-[var(--admin-text-primary)]">
        Product Image
      </label>

      {/* Main Image Upload Area */}
      <div
        className={`relative w-full aspect-square rounded-lg border-2 border-dashed transition-colors ${
          dragActive
            ? "border-[var(--admin-brand-primary)] bg-[var(--admin-accent)]"
            : "border-[var(--admin-border)] bg-[var(--admin-bg)]"
        } ${!mainImage ? "cursor-pointer" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload product image"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            document.getElementById("main-image-input")?.click();
          }
        }}
      >
        {mainImage ? (
          <>
            <Image
              src={mainImage.preview}
              alt="Main product image"
              fill
              className="object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage(mainImage.id);
              }}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-[var(--admin-grey)]" />
            </button>
            <label
              className="absolute bottom-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-100 transition-colors text-body-sm"
              htmlFor="replace-main-image"
            >
              <RefreshCw className="w-4 h-4" />
              Replace
            </label>
            <input
              id="replace-main-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleReplaceImage(mainImage.id, e.target.files[0]);
                }
                e.target.value = "";
              }}
            />
          </>
        ) : (
          <label
            htmlFor="main-image-input"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
            <ImageIcon className="w-12 h-12 text-[var(--admin-grey)] mb-2" />
            <span className="text-body-sm text-[var(--admin-grey)] flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Browse
            </span>
            <input
              id="main-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
          </label>
        )}
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-3 flex-wrap">
        {thumbnailImages.map((image) => (
          <div
            key={image.id}
            className="relative w-20 h-20 rounded-lg border border-[var(--admin-border)] overflow-hidden group"
          >
            <Image
              src={image.preview}
              alt="Product thumbnail"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(image.id)}
              className="absolute top-1 right-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="w-3 h-3 text-[var(--admin-grey)]" />
            </button>
          </div>
        ))}

        {/* Add More Button */}
        {canAddMore && images.length > 0 && (
          <label
            htmlFor="add-more-images"
            className="w-20 h-20 rounded-lg border-2 border-dashed border-[var(--admin-border)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--admin-brand-primary)] hover:bg-[var(--admin-accent)] transition-colors"
          >
            <Plus className="w-5 h-5 text-[var(--admin-brand-primary)]" />
            <span className="text-caption text-[var(--admin-brand-primary)] mt-1">
              Add Image
            </span>
            <input
              id="add-more-images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleInputChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};
