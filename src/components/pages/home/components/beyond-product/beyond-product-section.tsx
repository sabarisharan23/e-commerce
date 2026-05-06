"use client";

import Image from "next/image";
import { useState } from "react";
import { beyondProductFeatures } from "./beyond-product-data";

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7 fill-current"
    >
      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
    </svg>
  );
}

export function BeyondProductSection() {
  const [activeFeatureId, setActiveFeatureId] = useState(
    beyondProductFeatures[0]?.id ?? "",
  );
  const [isOpen, setIsOpen] = useState(false);

  const activeFeature =
    beyondProductFeatures.find((feature) => feature.id === activeFeatureId) ??
    beyondProductFeatures[0];

  return (
    <>
      <section className="bg-[#f7f8f3]">
        <div className="w-full px-4 py-10 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px]">
            <div className="relative min-h-[620px]">
              <Image
                src="/home/hero-millet-flour.png"
                alt="Freshly ground flour in sacks."
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/52" />

              <div className="absolute inset-x-0 top-1/3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  aria-label="Play brand story"
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#4f7d49] text-white shadow-lg transition-transform hover:scale-105"
                >
                  <PlayIcon />
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-6 px-4 sm:px-8 lg:px-12">
                <div className="overflow-hidden rounded-[28px] bg-[#dfead8]/85 backdrop-blur-sm">
                  <div className="grid lg:grid-cols-3">
                    {beyondProductFeatures.map((feature, index) => {
                      const active = feature.id === activeFeature.id;

                      return (
                        <button
                          key={feature.id}
                          type="button"
                          onClick={() => setActiveFeatureId(feature.id)}
                          className={`min-h-[145px] px-5 py-6 text-left transition-colors sm:px-8 ${
                            active ? "bg-[#e7f0df]" : "bg-transparent"
                          } ${index < beyondProductFeatures.length - 1 ? "border-b border-[#d9e3d3] lg:border-b-0 lg:border-r" : ""}`}
                        >
                          <p className="text-2xl font-semibold text-[#118611] sm:text-[2rem]">
                            {feature.title}
                          </p>
                          <p className="mt-1 text-2xl font-medium text-[#1f4b1b] sm:text-[2.1rem]">
                            {feature.subtitle}
                          </p>
                          {active ? (
                            <p className="mt-3 max-w-2xl text-base leading-8 text-[#1d2225] sm:text-[1.15rem]">
                              {feature.description}
                            </p>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <button
            type="button"
            aria-label="Close story video"
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[320px]">
                <Image
                  src="/home/hero-millet-flour.png"
                  alt="Freshly ground flour in sacks."
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4f7d49]">
                  Brand Story
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#1b2440]">
                  {activeFeature.subtitle}
                </h3>
                <p className="mt-5 text-base leading-8 text-[#5f675c]">
                  {activeFeature.description}
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#4f7d49] px-6 text-sm font-semibold text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
