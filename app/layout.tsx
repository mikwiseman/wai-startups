import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Генератор стартап-идей",
  description: "Персонализированный ИИ-помощник для генерации идей стартапов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
