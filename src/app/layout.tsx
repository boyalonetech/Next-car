import type { Metadata } from "next";
import { Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";

const geistSans = Unbounded({
  weight: "500",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Car App | Boy Alone Techs",
  description: "Simple car game built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
