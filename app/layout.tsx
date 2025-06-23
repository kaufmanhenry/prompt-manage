import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Layout } from "@/components/Layout";
import { PromptProvider } from "@/components/PromptContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeHtmlScript } from "@/components/ThemeHtmlScript";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prompt Manage",
  description: "Manage and organize your AI prompts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J61N380PQS"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J61N380PQS');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeHtmlScript />
        <Providers>
          <PromptProvider>
            <Layout>{children}</Layout>
            <Toaster />
          </PromptProvider>
        </Providers>
      </body>
    </html>
  );
}
