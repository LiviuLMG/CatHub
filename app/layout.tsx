import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthModalProvider } from "@/components/auth-modal-provider";
import { AuthModal } from "@/components/auth-modal";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CatMascot } from "@/components/cat-mascot";
import { PawTrail } from "@/components/paw-trail";
import { Analytics } from "@vercel/analytics/next";
import { CursorBlob } from "@/components/cursor-blob";
import { LottieMascot } from "@/components/lottie-mascot";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "CatHub - Digital Companion for Cat Owners",
  description: "Your complete digital companion for a healthier and happier cat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AuthModalProvider>
            <CursorBlob />
            <Navbar />
            <div className="relative z-10 pt-28">{children}</div>
            <Footer />
            <ScrollToTop />
            <LottieMascot />
            <CatMascot />
            <PawTrail />
            <AuthModal />
          </AuthModalProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--color-card)",
                color: "var(--color-foreground)",
                border: "1px solid var(--color-border)",
                borderRadius: "1rem",
              },
            }}
          />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}