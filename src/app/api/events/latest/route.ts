// app/api/alerts/recent/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // your Prisma client instance

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const recentEvents = await prisma.webhook_events.findMany({
      where: {
      },
      orderBy: {
        event_time: 'desc', // newest first
      },
      take: 20, // limit to last 20
      select: {
        id: true,
        event_type: true,
        event_time: true,
        resource_id: true,
        raw_payload: true,
        webhook_received_at: true,
      },
    });
     const serializedEvents = recentEvents.map(event => ({
      ...event,
      event_time: Number(event.event_time), // ✅ Safe for Unix ms timestamps
    }));

    return NextResponse.json(serializedEvents);
  } catch (error) {
    console.error('Failed to fetch recent webhook events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}