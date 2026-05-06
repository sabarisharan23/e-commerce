import Image from "next/image";

const logos = [
  {
    id: "villagananji-1",
    src: "/home/logos/villagananji.png",
    alt: "Villagananji logo",
  },
  {
    id: "theni-1",
    src: "/home/logos/theni-store.png",
    alt: "Theni Store logo",
  },
  {
    id: "villagananji-2",
    src: "/home/logos/villagananji.png",
    alt: "Villagananji logo",
  },
  {
    id: "theni-2",
    src: "/home/logos/theni-store.png",
    alt: "Theni Store logo",
  },
  {
    id: "villagananji-3",
    src: "/home/logos/villagananji.png",
    alt: "Villagananji logo",
  },
  {
    id: "theni-3",
    src: "/home/logos/theni-store.png",
    alt: "Theni Store logo",
  },
];

export function BrandStripSection() {
  const track = [...logos, ...logos];

  return (
    <section className="overflow-hidden bg-white py-6">
      <div className="brand-marquee-track flex w-max items-center gap-10">
        {track.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="relative h-[70px] w-[150px] shrink-0"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes="150px"
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
