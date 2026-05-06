import Link from "next/link";

export function CartBreadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm text-[#7d8ea7]"
    >
      <Link href="/" className="transition-colors hover:text-[#294b72]">
        Home
      </Link>
      <span>&gt;</span>
      <span className="text-[#4f7d49]">Shopping Cart</span>
    </nav>
  );
}
