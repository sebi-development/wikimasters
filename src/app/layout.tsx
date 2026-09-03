import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/nav/nav-bar";
import { Toaster } from "@/components/ui/toast";
import { StackProvider } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wikimasters",
  description: "Learn how to build and scale Next.js apps with Brian Holt",
};

import { StackThemeWrapper } from "@/components/stack-theme-wrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StackProvider app={stackServerApp}>
          <StackThemeWrapper>
            <NavBar />
            {children}
          </StackThemeWrapper>
        </StackProvider>
        <Toaster />
      </body>
    </html>
  );
}
