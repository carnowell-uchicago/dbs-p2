import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LazyDonkeyGames",
  description: "A landing page for a new online games site.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
