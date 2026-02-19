import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripeService } from "@/lib/stripe/stripe.service";
import { subscriptionService } from "@/lib/services/subscription.service";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event;

    try {
        event = stripeService.verifyWebhookSignature(body, signature);
    } catch (error) {
        console.error(`Webhook signature verification failed: ${error}`);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        await subscriptionService.handleWebhookEvent(event);
        return NextResponse.json({ received: true });
    } catch (error) {
        console.error(`Webhook handler failed: ${error}`);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}
