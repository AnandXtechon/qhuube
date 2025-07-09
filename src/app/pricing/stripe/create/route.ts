/* eslint-disable @typescript-eslint/no-explicit-any */
// app/pricing/stripe/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';


export async function POST(req: NextRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    try {
        const body = await req.json();
        const { amount, description } = body;

        if (!amount || !description) {
            return NextResponse.json({ error: 'Missing amount or description' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: [
                'card',
                'ideal',
                'bancontact',
                'sofort',
                'giropay',
                'eps',
            ],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: description,
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            automatic_tax: { enabled: true },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        });

        return NextResponse.json({ checkoutUrl: session.url });
    } catch (err: any) {
        console.log('Stripe Error:', err.message);
        return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 });
    }
}
