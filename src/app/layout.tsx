import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/app/providers";
import { ThemeProvider } from "./ThemeProvider";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SeiForge - Decentralized AI Personality Marketplace",
  description: "Create, store, and monetize AI personalities on the Sei Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-sei-offwhite text-sei-dark-gray dark:bg-gray-900 dark:text-white`}>
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
