"use client";

import { usePathname } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/layout";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show header/footer for dashboard routes (dashboard has its own layout)
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  // Don't show header/footer for auth routes (login, register, etc.)
  const isAuthRoute = pathname?.startsWith("/auth");

  if (isDashboardRoute || isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
