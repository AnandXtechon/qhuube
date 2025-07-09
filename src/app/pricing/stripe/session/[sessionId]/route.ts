/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from "next/server"
import Stripe from "stripe"


export async function GET(req: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    try {
        // Await the params since they're now async in Next.js 15
        const { sessionId } = await context.params

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items", "payment_intent"],
        })

        return NextResponse.json(session)
    } catch (err: any) {
        console.error("Stripe fetch error:", err.message)
        return NextResponse.json({ error: "Failed to fetch Stripe session" }, { status: 500 })
    }
}
