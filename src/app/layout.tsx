import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Space Invaders - Neon Edition",
  description: "A modern neon-themed Space Invaders game built with Next.js",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050510] text-white overflow-hidden">
        {/* CRT scanline overlay */}
        <div className="scanline" />
        {children}
      </body>
    </html>
  );
}
