import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "宝箱系统",
  description: "Treasure Box System",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
