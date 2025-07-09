import type React from "react"
// import type { Metadata } from "next"
import Navbar from "@/components/layouts/Navbar"
import Footer from "@/components/layouts/Footer"
import { ReactNode } from "react"


// export const metadata: Metadata = {
//     title: {
//         template: "%s | TaxTrack",
//         default: "TaxTrack - Your All-in-One Tax Solution",
//     },
//     description: "Streamline your tax management with TaxTrack's comprehensive platform for individuals and businesses.",
//     keywords: ["tax", "tracking", "finance", "accounting", "tax management"],
//     authors: [{ name: "TaxTrack Team" }],
//     creator: "TaxTrack",
//     metadataBase: new URL("https://taxtrack.com"),
//     openGraph: {
//         type: "website",
//         locale: "en_US",
//         url: "https://taxtrack.com",
//         title: "TaxTrack - Your All-in-One Tax Solution",
//         description: "Streamline your tax management with TaxTrack's comprehensive platform.",
//         siteName: "TaxTrack",
//     },
//     twitter: {
//         card: "summary_large_image",
//         title: "TaxTrack - Your All-in-One Tax Solution",
//         description: "Streamline your tax management with TaxTrack's comprehensive platform.",
//         creator: "@taxtrack",
//     },
//     robots: {
//         index: true,
//         follow: true,
//         googleBot: {
//             index: true,
//             follow: true,
//             "max-video-preview": -1,
//             "max-image-preview": "large",
//             "max-snippet": -1,
//         },
//     },
// }

export default function PricingLayout({ children }: { children: ReactNode })  {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
          <Footer />
        </>
    )
}
