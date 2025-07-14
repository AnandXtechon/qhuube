import type React from "react"
import Navbar from "@/components/layouts/Navbar"
import Footer from "@/components/layouts/Footer"
import { ReactNode } from "react"


export default function PricingLayout({ children }: { children: ReactNode })  {
    return (
        <div>
            <Navbar />
            <main>
                {children}
            </main>
          <Footer />
        </div>
    )
}
