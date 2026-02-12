import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "お題ボックス - Prompt Box App",
  description: "お題を共有して回答を集めるアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
