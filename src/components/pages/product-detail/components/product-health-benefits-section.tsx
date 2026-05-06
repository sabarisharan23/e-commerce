import Image from "next/image";
import type { ProductDetailContent } from "@/data/product-detail-content";

export function ProductHealthBenefitsSection({
  content,
}: {
  content: ProductDetailContent;
}) {
  return (
    <section className="border-t border-[#e5ebf0] pt-10">
      <h2 className="text-[2rem] font-semibold tracking-tight text-[#15203d]">
        Health Benefits
      </h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          {content.healthBenefits.map((benefit) => (
            <div key={benefit.title} className="rounded-[18px] bg-[#f4c91f] px-5 py-4">
              <h3 className="text-xl font-semibold text-[#1d253f]">{benefit.title}</h3>
              <p className="mt-1 text-sm font-medium leading-6 text-[#43506a]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="relative min-h-[300px] overflow-hidden rounded-[24px] border border-[#e5ebf0] bg-white">
          <Image
            src={content.healthBenefitsImage.src}
            alt={content.healthBenefitsImage.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
