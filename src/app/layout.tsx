import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileVerifyBar } from "@/components/layout/MobileVerifyBar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { AppToaster } from "@/components/ui/toaster";
import { SITE } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} Night Cream For Skin Whitening — Official Website`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.legalName,
    title: SITE.legalName,
    description: SITE.description,
    images: [{ url: SITE.logoUrl, alt: `${SITE.name} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.legalName,
    description: SITE.description,
    images: [SITE.logoUrl],
  },
  icons: {
    icon: SITE.logoUrl,
    apple: SITE.logoUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <OrganizationJsonLd />
        <Header />
        <main className="flex-1 pb-[calc(4.75rem+env(safe-area-inset-bottom))] sm:pb-0">{children}</main>
        <Footer />
        <MobileVerifyBar />
        <WhatsAppButton />
        <AppToaster />
      </body>
    </html>
  );
}
