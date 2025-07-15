import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import type React from "react"
import { ReactNode } from "react"
import { AppSidebar } from "./components/app-sidebar"


export default function PricingLayout({ children }: { children: ReactNode })  {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}
