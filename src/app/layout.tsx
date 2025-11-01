import { MuiThemeProvider } from "@/contexts/MuiThemeProvider";
import { ProgressBarProvider } from "@/contexts/ProgressBarProvider";
import { TRPCProvider } from "@/trpc/client";
import type { Viewport } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

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
    <html lang="ja" className={roboto.className}>
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href={process.env.FAVICON_PATH} sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <TRPCProvider>
          <MuiThemeProvider>
            <ProgressBarProvider>{children}</ProgressBarProvider>
            <Toaster richColors />
          </MuiThemeProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
