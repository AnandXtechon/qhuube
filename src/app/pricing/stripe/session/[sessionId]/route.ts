import { NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(_req: Request, { params }: { params: { sessionId: string } }) {
    try {
        const session = await stripe.checkout.sessions.retrieve(params.sessionId, {
            expand: ['line_items', 'payment_intent'], 
        });
          
        return NextResponse.json(session)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.log('Stripe fetch error: ', err.message)
        return NextResponse.json(
            { error: 'Failed to fetch stripe session' },
            { status: 500 }
        )
    }
}