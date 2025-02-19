import { Navigation } from "@/components/feature/layout/Navigation";
import { TRPCProvider } from "@/trpc/client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thread Note - スレッド形式のノートサービス",
  description:
    "Thread Note はスレッド形式で手軽にノートを残すことができるサービスです。",
  themeColor: "#ff8904",
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
          <Navigation />
          {children}
        </body>
      </TRPCProvider>
    </html>
  );
}
