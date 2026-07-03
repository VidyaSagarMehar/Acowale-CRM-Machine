import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";

import "@/app/globals.css";

const manrope = Manrope({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Acowale CRM Machine",
  description: "Production-ready MVP foundation for Acowale CRM feedback management."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
