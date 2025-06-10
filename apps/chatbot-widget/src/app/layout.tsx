import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HeyBo AI Chatbot",
  description: "AI-powered warm grain bowl ordering assistant",
  keywords: ["HeyBo", "chatbot", "AI", "grain bowls", "food ordering"],
  authors: [{ name: "1CloudHub" }],
  creator: "1CloudHub",
  robots: {
    index: false, // Widget should not be indexed
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
