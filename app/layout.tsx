import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Black Pearl Portal",
  description: "Black Pearl Portal Frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}