import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { ApolloWrapper } from "@/components/apollo-provider";
import { AuthInitializer } from "@/components/auth-initializer";
import { ErrorBoundary } from "@/components/error-boundary";
import { LogoutOverlay } from "@/components/logout-overlay";
import { getRobotsConfig } from "@/lib/seo-utils";
// import { SiteHeader, SiteFooter } from "@/components/layout";
import { LayoutWrapper } from "./layout-wrapper";

const inter = Inter({ subsets: ["latin"] });
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton"
});

export const metadata: Metadata = {
  title: "CultureOwl - Discover Arts and Culture",
  description: "Explore arts and culture events, venues, dining, and news in your city",
  robots: getRobotsConfig(),
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${anton.variable}`}>
        <ErrorBoundary>
          <ApolloWrapper>
            <LogoutOverlay />
            <AuthInitializer>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
                <Toaster />
                <SonnerToaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                      border: '1px solid hsl(var(--border))',
                    },
                    className: 'class',
                  }}
                />
              </ThemeProvider>
            </AuthInitializer>
          </ApolloWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
