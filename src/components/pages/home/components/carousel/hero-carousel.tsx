"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides } from "./carousel-data";

const AUTOPLAY_DELAY = 5000;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="w-full">
      <div className="relative overflow-hidden bg-[#201712]">
        {heroSlides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
              <div
                className={`absolute inset-0 ${
                  slide.overlayClassName ?? "bg-black/40"
                }`}
              />

              <div className="relative flex min-h-[320px] w-full items-center px-4 py-16 sm:min-h-[420px] sm:px-6 md:py-20 lg:min-h-[560px] lg:px-8">
                <div
                  className={`max-w-4xl text-white ${
                    slide.contentAlign === "left"
                      ? "text-left"
                      : "mx-auto text-center"
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#efba18] sm:text-base">
                    {slide.eyebrow}
                  </p>
                  <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-[4.1rem] lg:leading-[1.05]">
                    {slide.titleLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="mx-auto mt-5 max-w-4xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
                    {slide.description}
                  </p>
                  <a
                    href={slide.ctaHref}
                    className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#4f7d49] px-7 text-base font-semibold text-white transition-colors hover:bg-[#41693c] sm:mt-10 sm:h-14 sm:px-10 sm:text-[1.05rem]"
                  >
                    {slide.ctaLabel}
                  </a>
                </div>
              </div>
            </article>
          );
        })}

        <div className="relative flex min-h-[320px] w-full items-end justify-center px-4 pb-5 sm:min-h-[420px] sm:px-6 sm:pb-6 lg:min-h-[560px] lg:px-8 lg:pb-8">
          <div className="flex items-center gap-3 rounded-full bg-black/35 px-4 py-3 backdrop-blur-sm">
            {heroSlides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={`h-4 w-4 rounded-full transition-all ${
                    isActive ? "bg-[#5f8755]" : "bg-white/65 hover:bg-white"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
