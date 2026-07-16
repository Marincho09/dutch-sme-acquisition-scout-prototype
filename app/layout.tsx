import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Search Fund Sourcing Copilot",
  description: "Research, enrich and rank Dutch SME acquisition targets.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
