"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  src: string;
  alt: string;
};

export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative min-h-[280px] overflow-hidden rounded-[22px] bg-white sm:min-h-[360px]">
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 32vw"
            className="object-contain p-6"
          />
        </div>
        <div className="relative hidden min-h-[280px] overflow-hidden rounded-[22px] bg-white lg:block lg:min-h-[360px]">
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="32vw"
            className="object-contain p-6"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => {
          const active = index === activeIndex;

          return (
            <button
              key={`${image.src}-${index}`}
              type="button"
              aria-label={`Show product image ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`relative min-h-[92px] overflow-hidden rounded-[18px] border bg-white transition-colors sm:min-h-[110px] ${
                active ? "border-[#5f8755]" : "border-transparent"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 25vw, 12vw"
                className="object-contain p-3"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
