import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import Analytics from "./components/Analytics";
import CookieConsent from "./components/CookieConsent";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const devanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-deva" });

export const metadata = {
  title: "Qevora — AI Readiness for Your Business",
  description: "Scan your business, score your AI readiness, and discover where to save time and money.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${devanagari.variable} antialiased`} style={{ fontFamily: "var(--font-inter), var(--font-deva), sans-serif" }}>
        {children}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
