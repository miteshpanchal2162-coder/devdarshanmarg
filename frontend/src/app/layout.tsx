import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Devanagari, Noto_Sans_Gujarati } from "next/font/google";
import { MandalaBackground } from "@/components/admin/layout/mandala-background";
import { AppProviders } from "@/providers/app-providers";
import { publicSiteConfig } from "@/constants/public-site";
import { buildPublicMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoGujarati = Noto_Sans_Gujarati({
  variable: "--font-gujarati",
  subsets: ["gujarati"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
});

export const metadata: Metadata = {
  ...buildPublicMetadata({
    title: publicSiteConfig.name,
    description: publicSiteConfig.description,
    path: "/",
  }),
  title: {
    default: publicSiteConfig.name,
    template: `%s | ${publicSiteConfig.name}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoGujarati.variable} ${notoDevanagari.variable} font-sans`}
      >
        <AppProviders>
          <MandalaBackground />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
