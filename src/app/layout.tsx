import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: {
    template: "%s | QHUUBE",
    default: "QHUUBE - Your All-in-One Tax Solution",
  },
  description: "Streamline your tax management with QHUUBE's comprehensive platform for individuals and businesses.",
  keywords: ["tax", "tracking", "finance", "accounting", "tax management"],
  authors: [{ name: "QHUUBE Team" }],
  creator: "QHUUBE",
  metadataBase: new URL("https://qhuube.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://qhuube.com",
    title: "QHUUBE - Your All-in-One Tax Solution",
    description: "Streamline your tax management with QHUUBE's comprehensive platform.",
    siteName: "QHUUBE",
  },
  twitter: {
    card: "summary_large_image",
    title: "QHUUBE - Your All-in-One Tax Solution",
    description: "Streamline your tax management with QHUUBE's comprehensive platform.",
    creator: "@QHUUBE",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        <main>{children}</main>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
