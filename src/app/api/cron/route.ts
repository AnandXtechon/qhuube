import axios from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!backendUrl) {
            console.error("Missing BACKEND URL");
            return new Response("Backend URL not configured", { status: 500 });
        }

        const response = await axios.post(`${backendUrl}/api/v1/currency/daily_live_currency_sync`);

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Cron sync failed:", error?.response?.data || error.message);

        return new Response(
            JSON.stringify({ error: "Currency sync failed", details: error?.response?.data || error.message }),
            { status: error?.response?.status || 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
