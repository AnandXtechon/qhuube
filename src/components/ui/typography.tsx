import type React from "react"
import { cn } from "@/lib/utils"

interface TypographyProps {
    children: React.ReactNode
    className?: string
}

export function TypographyH1({ children, className }: TypographyProps) {
    return <h1 className={cn("text-display-lg font-bold tracking-tight", className)}>{children}</h1>
}

export function TypographyH2({ children, className }: TypographyProps) {
    return <h2 className={cn("text-display-md font-semibold tracking-tight", className)}>{children}</h2>
}

export function TypographyH3({ children, className }: TypographyProps) {
    return <h3 className={cn("text-display-sm font-semibold tracking-tight", className)}>{children}</h3>
}

export function TypographyP({ children, className }: TypographyProps) {
    return <p className={cn("leading-7 text-muted-foreground", className)}>{children}</p>
}

export function TypographyLead({ children, className }: TypographyProps) {
    return <p className={cn("text-xl text-muted-foreground leading-7", className)}>{children}</p>
}

export function TypographyFinancial({ children, className }: TypographyProps) {
    return <span className={cn("text-financial", className)}>{children}</span>
}

export function TypographyCurrency({ children, className }: TypographyProps) {
    return <span className={cn("text-currency", className)}>{children}</span>
}

export function TypographyLoss({ children, className }: TypographyProps) {
    return <span className={cn("text-loss", className)}>{children}</span>
}
