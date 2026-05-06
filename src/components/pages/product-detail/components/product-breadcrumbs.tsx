import Link from "next/link";

export function ProductBreadcrumbs({
  categoryLabel,
  productName,
}: {
  categoryLabel: string;
  productName: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm text-[#7d8ea7]"
    >
      <Link href="/" className="transition-colors hover:text-[#294b72]">
        Home
      </Link>
      <span>&gt;</span>
      <Link href="/products" className="transition-colors hover:text-[#294b72]">
        {categoryLabel}
      </Link>
      <span>&gt;</span>
      <span className="text-[#4f7d49]">{productName}</span>
    </nav>
  );
}
