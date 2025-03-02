import "@/styles/tailwind.css";
import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
  variable: "--font-spacemono-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Globetrotter",
  description:
    "App where users get cryptic clues about a famous place and must guess which destination it refers to. Once they guess, they’ll unlock fun facts, trivia, and surprises about the destination!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.className} antialiased bg-gray-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
