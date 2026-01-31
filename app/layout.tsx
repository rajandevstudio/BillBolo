import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'; // <--- IMPORT CLERK

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoiceOS | Business Automation",
  description: "Automate your shop with voice commands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Wrap everything in ClerkProvider
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}