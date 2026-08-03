import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "HerbChain AI – Blockchain Botanical Traceability System",
  description: "Smart India Hackathon 2025 Flagship Application for Ministry of AYUSH. Complete end-to-end traceability of Ayurvedic herbs using Polygon Blockchain, IPFS, QR Codes, and AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-emerald-950 text-emerald-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-emerald-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
