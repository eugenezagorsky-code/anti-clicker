import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { CrtShell } from "@/components/ui/CrtShell";
import { GameProvider } from "@/context/GameContext";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Invisible Clicker",
  description:
    "A dark-satire anti-clicker exposing the hidden costs of AI compute.",
  openGraph: {
    title: "The Invisible Clicker",
    description:
      "A dark-satire anti-clicker exposing the hidden costs of AI compute.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Invisible Clicker",
    description:
      "A dark-satire anti-clicker exposing the hidden costs of AI compute.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${ibmPlexMono.variable} font-mono`}>
        <GameProvider>{children}</GameProvider>
        <CrtShell />
      </body>
    </html>
  );
}
