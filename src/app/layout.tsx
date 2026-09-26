import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { SavedProvider } from "@/context/SavedContext";
import { ToastProvider } from "@/context/ToastContext";

export const viewport: Viewport = {
  themeColor: "#FAF9F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "BRIEFLY — Your areas. Your interests. Just the news that matters.",
  description:
    "A clean, personalized, multi-source daily news briefing platform. Local + national + international news, short video briefings, official NDMA disaster alerts, and AI-assisted clarity.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "BRIEFLY — Personalized Daily News Platform",
    description: "Your areas. Your interests. Just the news that matters.",
    siteName: "BRIEFLY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-editorial-bg text-foreground transition-colors selection:bg-editorial-accent selection:text-white">
        <ToastProvider>
          <AuthProvider>
            <PreferencesProvider>
              <SavedProvider>{children}</SavedProvider>
            </PreferencesProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
