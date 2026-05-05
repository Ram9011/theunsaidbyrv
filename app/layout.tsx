import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1",
  title: "The Girl Who Forgot Her Earrings — Raj Vishwakarma",
  description: "She forgot her earrings. He kept them forever.",
  authors: [{ name: "Raj Vishwakarma" }],
  openGraph: {
    title: "The Girl Who Forgot Her Earrings",
    description: "She forgot her earrings. He kept them forever.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400;1,700;1,800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500&family=Kalam:wght@300;400;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
