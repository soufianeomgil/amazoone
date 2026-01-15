"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type UploadResult = {
  url: string;
  publicId: string;
};

interface FileUploadProps {
  onFileSelect: (file: UploadResult) => void;
  preview?: string;
  onRemove?: () => void;
  className?: string;
  multiple?: boolean;
  uploadPreset?: string; // for unsigned uploads
  signatureEndpoint?: string; // for signed uploads
}

export const FileUploadCloudinary: React.FC<FileUploadProps> = ({
  onFileSelect,
  preview,
  onRemove,
  className,
  multiple = false,
  uploadPreset = "amazone-clone",
  signatureEndpoint,
}) => {
  return (
    <div className={cn("relative group", className)}>
      {preview ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
          <Image fill src={preview} alt="Preview" className="w-full h-full object-cover" />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {/* Cloudinary widget overlay for changing the image */}
          <CldUploadWidget
            onUpload={(result) => {
              const info = (result?.info ?? result) as any;
              if (info?.secure_url && info?.public_id) {
                onFileSelect({ url: info.secure_url, publicId: info.public_id });
              }
            }}
            uploadPreset={uploadPreset}
            signatureEndpoint={signatureEndpoint}
            options={{
              multiple,
              sources: ["local", "url", "camera", "image_search", "google_drive", "dropbox"],
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open?.()}
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
                aria-label="Change image"
              >
                <Upload className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            )}
          </CldUploadWidget>
        </div>
      ) : (
        <CldUploadWidget
          onUpload={(result) => {
            const info = (result?.info ?? result) as any;
            if (info?.secure_url && info?.public_id) {
              onFileSelect({ url: info.secure_url, publicId: info.public_id });
            }
          }}
          uploadPreset={uploadPreset}
          signatureEndpoint={signatureEndpoint}
          options={{
            multiple,
            sources: ["local", "url", "camera"],
          }}
        >
          {({ open }) => (
            <div
              onClick={() => open?.()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") open?.();
              }}
              className={cn(
                "w-full h-32 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer",
                "flex flex-col items-center justify-center space-y-2",
                "hover:border-blue-400 hover:bg-blue-50/50"
              )}
            >
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  Click to upload with Cloudinary
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 10MB (managed by Cloudinary)
                </p>
              </div>
            </div>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
};
