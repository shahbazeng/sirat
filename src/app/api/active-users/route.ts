import { NextResponse } from "next/server";
// Yahan import add karein (Aapki file ke mutabiq path check kar lena)
import { redis } from "@/lib/redis"; // Ya jo bhi aapka path hai

export async function GET() {
   try {
     const keys = await redis.keys("active_user:*");
     return NextResponse.json({ count: keys ? keys.length : 0 });
   } catch (error) {
     return NextResponse.json({ count: 0 });
   }
}