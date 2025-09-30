import { prisma } from "@/lib/prisma";
import { uberFetch } from "@/lib/uber";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const { id } = params;
  console.log("order id", id);
  try {
    const response = await uberFetch(`/v2/eats/order/${id}`);
    return NextResponse.json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error accepting order:", errorMessage);
    return NextResponse.json(
      { error: errorMessage, message: "Error occurred while accepting order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { newState } = body; // expecting { newState: "PREPARING" | "READY" }

    if (!newState) {
      return NextResponse.json({ error: "Missing newState" }, { status: 400 });
    }

    // Update local DB state
    // console.log(params.id, newState);

    // const order= await prisma.order.findFirst({where:{id:params.id}})
    // console.log("order in db", order);

    // const result = await prisma.order.update({
    //   where: { id: params.id },
    //   data: {
    //     currentState: newState,
    //   },
    // });
    // console.log(result);

    // If order is marked READY, call Uber API
    if (newState === "READY") {
      try {
        const response = await fetch(
          `${process.env.UBER_API_BASE}/v1/delivery/order/${params.id}/ready`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.UBER_ACCESS_TOKEN}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(response?.status + " " + response.statusText);
        }
        await prisma.order.update({
          where: { id: params.id },
          data: {
            currentState: newState,
          },
        });
        return NextResponse.json({ message: "Order Ready For Delivery" });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Error accepting order:", errorMessage);
        return NextResponse.json(
          {
            error: errorMessage,
            message: "Error occurred while rejecting order",
          },
          { status: 500 }
        );
      }
    }
    if (newState === "ACCEPTED") {
      try {
        const response = await fetch(
          `${process.env.UBER_API_BASE}/v1/eats/orders/${params.id}/accept_pos_order`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.UBER_ACCESS_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(response?.status + " " + response.statusText);
        }
        await prisma.order.update({
          where: { id: params.id },
          data: {
            currentState: newState,
          },
        });
        return NextResponse.json({ message: "Order Accepted successfully" });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Error accepting order:", errorMessage);
        return NextResponse.json(
          {
            error: errorMessage,
            message: "Error occurred while accepting order",
          },
          { status: 500 }
        );
      }
    }
    if (newState === "REJECTED") {
      try {
        const response = await fetch(
          `${process.env.UBER_API_BASE}/v1/eats/orders/${params.id}/deny_pos_order`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.UBER_ACCESS_TOKEN}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(response?.status + " " + response.statusText);
        }
        await prisma.order.update({
          where: { id: params.id },
          data: {
            currentState: newState,
          },
        });
        return NextResponse.json({ message: "Order Rejected successfully" });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Error accepting order:", errorMessage);
        return NextResponse.json(
          {
            error: errorMessage,
            message: "Error occurred while rejecting order",
          },
          { status: 500 }
        );
      }
    }
    if (newState === "PREPARING") {
      await prisma.order.update({
        where: { id: params.id },
        data: {
          currentState: newState,
        },
      });
      return NextResponse.json({message: "Order state updated successfully", success: true });
    }
    return NextResponse.json({message:"Correct State not provided"}, {status:400})
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
