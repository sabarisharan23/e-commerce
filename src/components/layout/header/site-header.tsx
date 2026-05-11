"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthModal } from "@/components/shared/auth/auth-modal";
import { useAuth } from "@/components/shared/auth/auth-provider";
import { useCart } from "@/components/shared/cart/cart-provider";
import { useWishlist } from "@/components/shared/wishlist/wishlist-provider";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop By", href: "/products" },
  { label: "Special Offers", href: "/products" },
];

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 20-7-6.4a4.5 4.5 0 0 1 6.2-6.5L12 8l.8-.9a4.5 4.5 0 1 1 6.2 6.5L12 20Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.6-3.2 4.3-4.8 8-4.8s6.4 1.6 8 4.8" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 5h2l2.1 9.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H7" />
      <circle cx="10" cy="19" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="19" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13a8 8 0 1 1 16 0" />
      <rect x="3" y="12" width="4" height="8" rx="2" />
      <rect x="17" y="12" width="4" height="8" rx="2" />
      <path d="M7 20h10" />
    </svg>
  );
}

function LogoMark() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Theni Store home">
      <Image
        src="/images/logo.png"
        alt="Theni Store"
        width={2458}
        height={1745}
        priority
        sizes="(max-width: 640px) 6.5rem, 7.5rem"
        className="h-14 w-auto object-contain sm:h-16"
      />
    </Link>
  );
}

function ProfileToken({ initials }: { initials: string }) {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(145deg,#f8dccd,#e8b79d)] text-[0.72rem] font-bold tracking-[0.08em] text-[#24304a] shadow-[0_6px_14px_rgba(28,36,58,0.14)]">
      {initials}
    </span>
  );
}

function TopAction({
  label,
  children,
  href,
  badge,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  href?: string;
  badge?: number;
  onClick?: () => void;
}) {
  const content = (
    <div className="relative flex flex-col items-center gap-1.5 text-[#2b3550] transition-colors hover:text-[#4f7d49]">
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        {children}
        {badge ? (
          <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5f8755] px-1 text-[0.65rem] font-semibold text-white">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em]">
        {label}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className="inline-flex">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className="inline-flex">
      {content}
    </button>
  );
}

function MobileIconButton({
  label,
  children,
  onClick,
  href,
  badge,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  badge?: number;
}) {
  const content = (
    <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e4eadf] bg-white text-[#2b3550] transition-colors hover:border-[#b8cfb2] hover:text-[#4f7d49]">
      {children}
      {badge ? (
        <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5f8755] px-1 text-[0.65rem] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className="inline-flex">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className="inline-flex">
      {content}
    </button>
  );
}

export function SiteHeader() {
  const { user, isAuthenticated, isReady } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = () => {
    setMobileMenuOpen(false);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const showAuthenticatedState = isReady && isAuthenticated && user;
  const accountLabel = showAuthenticatedState ? "Profile" : "Account";
  const accountHref = showAuthenticatedState ? "/account" : undefined;
  const accountOnClick = showAuthenticatedState ? undefined : openAuthModal;
  const accountVisual = showAuthenticatedState ? (
    <ProfileToken initials={user.avatarInitials} />
  ) : (
    <UserIcon />
  );

  return (
    <>
      <header className="border-b border-[#e7ebe6] bg-white">
        <div className="w-full border-b border-[#eef1eb] px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <div className="flex items-center gap-3">
              <MobileIconButton
                label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </MobileIconButton>
              <LogoMark />
            </div>

            <div className="flex items-center gap-2">
              <MobileIconButton
                label={accountLabel}
                href={accountHref}
                onClick={accountOnClick}
              >
                {accountVisual}
              </MobileIconButton>
              <MobileIconButton label="Cart" href="/cart" badge={cartCount}>
                <CartIcon />
              </MobileIconButton>
            </div>
          </div>

          <div className="hidden w-full gap-4 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-8">
            <div className="justify-self-start">
              <LogoMark />
            </div>

            <form action="/products" method="get" className="w-full">
              <label className="flex h-12 w-full items-center gap-3 rounded-2xl bg-[#eef4fb] px-4 text-[#7d8da5]">
                <SearchIcon />
                <input
                  type="search"
                  name="q"
                  placeholder="Search for fresh organic products..."
                  className="w-full border-none bg-transparent text-base text-[#25314a] outline-none placeholder:text-[#72819a]"
                />
              </label>
            </form>

            <div className="flex items-center justify-start gap-6 justify-self-start lg:justify-self-end">
              <TopAction label="Wishlist" href="/wishlist" badge={wishlistCount}>
                <HeartIcon />
              </TopAction>
              <TopAction label={accountLabel} href={accountHref} onClick={accountOnClick}>
                {accountVisual}
              </TopAction>
              <TopAction label="Cart" href="/cart" badge={cartCount}>
                <CartIcon />
              </TopAction>
            </div>
          </div>

          <form action="/products" method="get" className="mt-3 lg:hidden">
            <label className="flex h-11 w-full items-center gap-3 rounded-2xl bg-[#eef4fb] px-4 text-[#7d8da5]">
              <SearchIcon />
              <input
                type="search"
                name="q"
                placeholder="Search for fresh organic products..."
                className="w-full border-none bg-transparent text-sm text-[#25314a] outline-none placeholder:text-[#72819a]"
              />
            </label>
          </form>
        </div>

        <div className="hidden w-full px-4 py-3 sm:px-6 lg:block lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4f7d49] px-6 text-base font-semibold text-white transition-colors hover:bg-[#41693c]"
              >
                <MenuIcon />
                <span>Browse Categories</span>
              </Link>

              <nav
                aria-label="Primary"
                className="flex flex-wrap items-center gap-x-10 gap-y-3 pl-0 lg:pl-4"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-base font-semibold text-[#44546f] transition-colors hover:text-[#4f7d49]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <a
              href="tel:+18006742642"
              className="inline-flex items-center gap-2 self-start text-[#4f7d49] transition-colors hover:text-[#41693c] lg:self-auto"
            >
              <HeadsetIcon />
              <span className="text-[1.65rem] font-semibold tracking-tight">
                1-800-ORGANIC
              </span>
            </a>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/45"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute left-0 top-0 flex h-full w-[88vw] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eef1eb] px-5 py-4">
              <LogoMark />
              <MobileIconButton
                label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CloseIcon />
              </MobileIconButton>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4f7d49] px-6 text-base font-semibold text-white transition-colors hover:bg-[#41693c]"
              >
                <MenuIcon />
                <span>Browse Categories</span>
              </Link>

              <nav aria-label="Mobile Primary" className="mt-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base font-semibold text-[#44546f] transition-colors hover:bg-[#f3f6ef] hover:text-[#4f7d49]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl border border-[#e4eadf] bg-[#fafcf8] px-3 py-4 text-center"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2b3550]">
                    <span className="relative inline-flex">
                      <HeartIcon />
                      {wishlistCount ? (
                        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5f8755] px-1 text-[0.65rem] font-semibold text-white">
                          {wishlistCount}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#44546f]">
                    Wishlist
                  </p>
                </Link>
                {accountHref ? (
                  <Link
                    href={accountHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl border border-[#e4eadf] bg-[#fafcf8] px-3 py-4 text-center"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2b3550]">
                      {accountVisual}
                    </div>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#44546f]">
                      {accountLabel}
                    </p>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="rounded-2xl border border-[#e4eadf] bg-[#fafcf8] px-3 py-4 text-center"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2b3550]">
                      {accountVisual}
                    </div>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#44546f]">
                      {accountLabel}
                    </p>
                  </button>
                )}
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl border border-[#d6e5d0] bg-[#f4f8f1] px-3 py-4 text-center"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2b3550]">
                    <span className="relative inline-flex">
                      <CartIcon />
                      {cartCount ? (
                        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5f8755] px-1 text-[0.65rem] font-semibold text-white">
                          {cartCount}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#44546f]">
                    Cart
                  </p>
                </Link>
              </div>
            </div>

            <div className="border-t border-[#eef1eb] px-5 py-5">
              <a
                href="tel:+18006742642"
                className="inline-flex items-center gap-3 text-[#4f7d49]"
              >
                <HeadsetIcon />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7d8ea7]">
                    Customer Care
                  </p>
                  <p className="text-xl font-semibold tracking-tight">
                    1-800-ORGANIC
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {authModalOpen ? (
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      ) : null}
    </>
  );
}
