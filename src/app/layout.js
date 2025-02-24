import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Calvin & Jestina Wedding Album",
  description: "Forever begins today. Welcome to our wedding album.",
  keywords: "wedding, album, love story, marriage, celebration",
  openGraph: {
    title: "Calvin & Khin Wedding Album",
    description: "Forever begins today. Welcome to our wedding album.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Wedding Cover",
      },
    ],
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Calvin & Khin Wedding Album",
    description: "Forever begins today. Welcome to our wedding album.",
    images: ["https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1200"],
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#f4e4d8",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
