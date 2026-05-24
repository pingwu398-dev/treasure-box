import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "📦 宝箱系统",
  description: "写秘密、开惊喜的宝箱互动工具",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1",
  themeColor: "#f5f0e8",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "宝箱" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full bg-[var(--bg)]">{children}</body>
    </html>
  );
}
