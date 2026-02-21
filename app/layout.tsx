import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { Rajdhani, Inter } from "next/font/google";

// Configure fonts and expose them as CSS variables for use in globals.css
const rajdhani = Rajdhani({
  // Valid Rajdhani weights: 300, 400, 500, 600, 700
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rajdhani",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lama | Your Neighborhood Convenience",
  description: "Fresh food, cold drinks, and everyday essentials at Lama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${inter.variable}`}>
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

