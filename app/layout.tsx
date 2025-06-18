import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Layout } from "@/components/Layout";
import { PromptProvider } from "@/components/PromptContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeHtmlScript } from "@/components/ThemeHtmlScript";

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
