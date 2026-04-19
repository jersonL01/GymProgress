import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GymProgress",
  description: "App de rutinas, progreso y entrenamiento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}