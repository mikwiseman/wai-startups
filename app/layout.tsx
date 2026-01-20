import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Startup Idea Generator",
  description: "Personalized AI assistant for generating startup ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
