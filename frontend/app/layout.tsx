import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRASASTA Learning Center - Pelatihan Mekanik Alat Berat & Operator",
  description: "Training center profesional untuk pelatihan mekanik alat berat dan operator. Kursus berkualitas dengan instruktur berpengalaman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

