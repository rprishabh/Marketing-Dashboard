import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import { BusinessModelProvider } from "./context/BusinessModelContext";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MKT-OPS // Marketing Command Center",
  description:
    "High-performance marketing operations dashboard — paid performance, pipeline architecture, and AI engine diagnostics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased dark`}>
      <body className="min-h-full flex bg-slate-950 text-slate-100 font-sans scanline-overlay">
        <BusinessModelProvider>
          <Sidebar />
          <main className="flex-1 min-h-screen overflow-y-auto grid-bg">
            <TopNav />
            {/* Page content */}
            <div className="p-4 sm:p-8">{children}</div>
          </main>
        </BusinessModelProvider>
      </body>
    </html>
  );
}
