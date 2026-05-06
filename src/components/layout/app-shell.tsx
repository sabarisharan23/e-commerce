"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./footer/site-footer";
import { SiteHeader } from "./header/site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute) {
    return <main className="min-h-full">{children}</main>;
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
