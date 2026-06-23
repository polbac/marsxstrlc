import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Syne_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const syneMono = Syne_Mono({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "CRONICAS MARS x STRLC RECORDS",
    template: "%s",
  },
  description: "Bitácora del proceso creativo de la obra sonora de Mars.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${syneMono.variable} ${plexMono.variable} dark h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
