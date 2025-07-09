import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: NextRequest, context: { params: { sessionId: string } }) {
    const { sessionId } = context.params

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'payment_intent'],
        })

        return NextResponse.json(session)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error('Stripe fetch error:', err.message)
        return NextResponse.json({ error: 'Failed to fetch Stripe session' }, { status: 500 })
    }
}
