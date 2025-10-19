import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreamPlay - HLS Video Player",
  description: "Stream HLS videos online with a modern, user-friendly player",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />

        <Script
          src="https://cdn.jsdelivr.net/npm/hls.js@latest"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.plyr.io/3.7.8/plyr.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
