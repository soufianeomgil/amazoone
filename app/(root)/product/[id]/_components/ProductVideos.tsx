"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface ProductVideo {
  url: string;
  thumbnail?: string;
}

const ProductVideos = ({ videos }: { videos: ProductVideo[] }) => {
  const [active, setActive] = useState<number | null>(null);

  if (!videos?.length) return null;

  return (
    <section className="mt-6 w-full">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Product videos
      </h2>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {videos.map((video, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className="
              relative aspect-video rounded-lg border
              overflow-hidden bg-black
            "
          >
            {video.thumbnail ? (
              <Image
                src={video.thumbnail}
                alt="Product video thumbnail"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-200">
                <Play className="h-8 w-8 text-gray-600" />
              </div>
            )}

            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="h-10 w-10 text-white" />
            </div>
          </button>
        ))}
      </div>

      {/* Video Player */}
      {active !== null && (
        <div className="mt-4">
          <video
            src={videos[active].url}
            controls
            playsInline
            className="w-full rounded-lg bg-black"
          />
        </div>
      )}
    </section>
  );
};

export default ProductVideos;
