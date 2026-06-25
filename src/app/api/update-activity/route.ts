import { redis } from "@/lib/redis";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    // User activity ko update karein (TTL: 30 seconds)
    await redis.set(`active_user:${ip}`, Date.now(), { ex: 30 });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}