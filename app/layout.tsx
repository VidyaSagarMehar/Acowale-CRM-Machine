import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Acowale CRM Machine",
  description: "Production-ready MVP foundation for Acowale CRM feedback management."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
