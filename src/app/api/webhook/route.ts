// app/api/webhook/route.ts
import { prisma } from "@/lib/prisma";
import { uberFetch } from "@/lib/uber";
import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { v4 as uuidv4 } from 'uuid';

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

    await handleWebhook(payload)

    // const existing = await prisma.webhook_events.findUnique({
    //   where: { event_id: payload.event_id },
    // });
    // if(existing){
    //   return Response.json({ success: true });
    // }


    return Response.json({ success: true });
  } catch (err) {
    console.error("🔥 Webhook error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


const handleWebhook=async(payload:any)=>{
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

    const event_type= payload?.event_type

    console.log("event type", event_type);
    console.log(payload);
    

    switch(event_type){
      case "orders.notification":
        await handleCreateOrder(payload?.meta?.resource_id as string, payload?.event_id as string)
        break;
      default:
        return
    }
    return
}

const handleCreateOrder=async (id:string, eventId:string)=>{

  console.log("create order called");
  fetch(`${process.env.API_BASE_URL}/api/uber_eats/orders/${id}`).then(res=>res.json()).then(data=>{
    console.log(data);
    
    storeNewOrder(data, eventId)
  })
}

const storeNewOrder = async (orderData: any, eventId: string) => {
  return prisma.$transaction(async (tx) => {
    // 1. Store
    const store = await tx.store.upsert({
      where: { id: orderData.store.id },
      create: { id: orderData.store.id, name: orderData.store.name },
      update: { name: orderData.store.name }
    });

    // 2. Eater — use phone-based ID
    const eaterId = orderData.eater.phone
      ? `eater_${orderData.eater.phone.replace(/\D/g, '')}`
      : `eater_${orderData.id}`;

    const eater = await tx.eater.upsert({
      where: { id: eaterId },
      create: {
        id: eaterId,
        firstName: orderData.eater.first_name,
        lastName: orderData.eater.last_name || null,
        phone: orderData.eater.phone || null,
        phoneCode: orderData.eater.phone_code || null
      },
      update: {
        firstName: orderData.eater.first_name,
        lastName: orderData.eater.last_name || null,
        phone: orderData.eater.phone || null,
        phoneCode: orderData.eater.phone_code || null
      }
    });

    // 3. Payment
    const payment = await tx.payment.create({
      data: {
        id: `payment_${orderData.id}`,
        totalAmount: orderData.payment.charges.total.amount,
        totalCurrency: orderData.payment.charges.total.currency_code,
        subTotalAmount: orderData.payment.charges.sub_total.amount,
        subTotalCurrency: orderData.payment.charges.sub_total.currency_code,
        accounting: orderData.payment.accounting || {}
      }
    });

    // 4. Packaging
    let packagingId: string | null = null;
    if (orderData.packaging?.disposable_items !== undefined) {
      const packaging = await tx.packaging.create({
        data: {
          id: `packaging_${orderData.id}`,
          shouldInclude: orderData.packaging.disposable_items.should_include
        }
      });
      packagingId = packaging.id;
    }

    // 5. Cart
    const cart = await tx.cart.create({
      data: {
        id: `cart_${orderData.id}`,
        fulfillmentIssues: orderData.cart.fulfillment_issues || []
      }
    });

    // 6. Cart Items (already correct)
    if (Array.isArray(orderData.cart.items) && orderData.cart.items.length > 0) {
      const cartItems = orderData.cart.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        externalData: item.external_data || null,
        quantity: item.quantity,
        instanceId: item.instance_id || null,
        eaterId: item.eater_id || null,
        unitPriceAmount: item.price.unit_price.amount,
        unitPriceCurrency: item.price.unit_price.currency_code,
        totalPriceAmount: item.price.total_price.amount,
        totalPriceCurrency: item.price.total_price.currency_code,
        baseUnitPriceAmount: item.price.base_unit_price.amount,
        baseTotalPriceAmount: item.price.base_total_price.amount,
        cartId: cart.id
      }));
      await tx.cartItem.createMany({ data: cartItems });
    }

    // 7. Order
    const order = await tx.order.create({
      data: {
        id: orderData.id,
        displayId: orderData.display_id,
        currentState: orderData.current_state,
        type: orderData.type,
        brand: orderData.brand,
        placedAt: new Date(orderData.placed_at),
        lastEventId: eventId,
        storeId: store.id,
        eaterId: eater.id,
        cartId: cart.id,
        paymentId: payment.id,
        packagingId: packagingId
      }
    });

    return order;
  });
};