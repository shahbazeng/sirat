import { NextResponse } from 'next/server';

// Server-side global store
declare global {
  var activeUsersCount: number;
}
global.activeUsersCount = global.activeUsersCount || 0;

export async function GET() {
  try {
    // Redis mein jitni bhi 'active_user:*' keys hain, unhe count karo
    const keys = await redis.keys("active_user:*");
    return NextResponse.json({ count: keys ? keys.length : 0 });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}