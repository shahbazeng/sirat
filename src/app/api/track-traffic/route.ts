import { redis } from "@/lib/redis";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    // Geo-data fetch (Free service for demo)
    const geo = await fetch(`http://ip-api.com/json/${ip.split(',')[0]}`).then(res => res.json()).catch(() => ({}));
    
    const userData = {
      ip,
      city: geo.city || "Unknown",
      country: geo.country || "Unknown",
      lastActive: Date.now(),
      path: body.path
    };

    await redis.set(`active_user:${ip}`, JSON.stringify(userData), { ex: 30 });
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function GET() {
  try {
    // Redis se keys mangwayein
    const keys = await redis.keys("active_user:*");
    // Ensure keys is an array before checking length
    const count = Array.isArray(keys) ? keys.length : 0;
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}

 




 