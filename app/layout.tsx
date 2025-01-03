import type { Metadata } from "next";
import { Asap, Inter, Recursive, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const asap = Asap({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Ragdoll",
  description: "Ragdoll is a RAG as a service platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${asap.variable} ${inter.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
