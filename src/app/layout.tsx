import { ProgressBarProvider } from "@/contexts/ProgressBarProvider";
import { TRPCProvider } from "@/trpc/client";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffb86a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href={process.env.FAVICON_PATH} sizes="any" />
      <TRPCProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <ProgressBarProvider>{children}</ProgressBarProvider>
          <Toaster richColors />
        </body>
      </TRPCProvider>
    </html>
  );
}
