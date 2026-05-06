import type { ProductDetailContent } from "@/data/product-detail-content";

function SectionCard({
  title,
  items,
  accent = "yellow",
}: {
  title: string;
  items: string[];
  accent?: "yellow" | "dark";
}) {
  const cardClassName =
    accent === "yellow"
      ? "bg-[#f4c91f] text-[#24304a]"
      : "border border-[#cedfc8] bg-white text-[#4f5f70]";

  return (
    <div>
      <h2 className="text-center text-[2rem] font-semibold tracking-tight text-[#15203d]">
        {title}
      </h2>
      <div className={`mt-5 rounded-[22px] p-6 ${cardClassName}`}>
        <ul className="space-y-2 text-base font-medium leading-7">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-current" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProductInfoSections({
  content,
}: {
  content: ProductDetailContent;
}) {
  return (
    <div className="space-y-10 border-t border-[#e5ebf0] pt-10">
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Product Highlights" items={content.keyBenefits} />
        <SectionCard title="Ingredients" items={content.ingredients} />
      </div>

      <div className="border-t border-[#e5ebf0] pt-10">
        <h2 className="text-center text-[2rem] font-semibold tracking-tight text-[#15203d]">
          How to Use
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {content.howToUse.map((item, index) => (
            <div key={item} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ff7817] text-xl font-semibold text-[#1f1f1f]">
                {index + 1}
              </div>
              <p className="mx-auto mt-5 max-w-xs text-lg font-medium leading-8 text-[#1a2440]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 border-t border-[#e5ebf0] pt-10 lg:grid-cols-2">
        <SectionCard
          title="Storage Instructions"
          items={content.storageInstructions}
          accent="dark"
        />
        <SectionCard
          title="Net Weight"
          items={content.netWeightOptions}
          accent="dark"
        />
      </div>
    </div>
  );
}
