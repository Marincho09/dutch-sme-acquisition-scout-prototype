import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dutch SME Acquisition Scout — Interactive Prototype",
  description: "An interactive prototype for researching and ranking Dutch SME acquisition targets using public evidence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
