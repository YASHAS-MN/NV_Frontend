import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { CosmicBackdrop } from "@/components/nebula/cosmic-backdrop";
import { CosmicCursor } from "@/components/nebula/cosmic-cursor";
import { NebulaProvider } from "@/components/nebula/nebula-provider";
import { WalletProvider } from "@/context/wallet-context";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEBULAverse | Autonomous P2P Software Exchange",
  description:
    "NEBULAverse is a decentralized software exchange for verified artifacts, custom build requests, escrow-backed transactions, and miner-powered settlement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${monoFont.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <NebulaProvider>
          <WalletProvider>
            <CosmicBackdrop />
            <CosmicCursor />
            {children}
          </WalletProvider>
        </NebulaProvider>
      </body>
    </html>
  );
}
