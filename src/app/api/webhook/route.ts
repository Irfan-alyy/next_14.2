// app/api/webhook/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

// 🔥 Critical: Force this route to run in Node.js (not Edge)
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Get raw body as ArrayBuffer → convert to Buffer
    const rawBody = await request.arrayBuffer();
    const bodyBuffer = Buffer.from(rawBody);

    const signature = request.headers.get("x-uber-signature");
    const SIGNING_SECRET = process.env.UBER_SIGNING_SECRET;

    if (!SIGNING_SECRET) {
      console.error("❌ Missing UBER_SIGNING_SECRET");
      return Response.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    if (!signature) {
      return Response.json({ error: "Missing signature" }, { status: 401 });
    }

    // ✅ Use Node.js crypto (createHmac is available)
    const expectedSignature = createHmac("sha256", SIGNING_SECRET)
      .update(bodyBuffer)
      .digest("hex");

    // Compare securely
    const isValid = timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );

    if (!isValid) {
      console.warn("❌ Invalid signature");
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse payload
    const payload = JSON.parse(bodyBuffer.toString());
    console.log("✅ Verified webhook:", payload);

    const existing = await prisma.webhook_events.findUnique({
      where: { event_id: payload.event_id },
    });
    if(existing){
      return Response.json({ success: true });
    }
    await prisma.webhook_events.create({
      data: {
        event_id: payload.event_id,
        event_type: payload.event_type,
        event_time: BigInt(payload.event_time), // ✅ Convert to BigInt
        resource_id: payload.meta.resource_id,
        status: payload.meta.status,
        client_id: payload.webhook_meta.client_id,
        raw_payload: payload, // Prisma handles JSON serialization
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("🔥 Webhook error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
