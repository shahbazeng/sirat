import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Yahan direct initialize karein agar lib wala issue hai

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received data:", body);
    
    // Check karein ke prisma object define hai ya nahi
    if (!prisma.discussion) {
      return NextResponse.json({ error: "Prisma Discussion model not found" }, { status: 500 });
    }

    const message = await prisma.discussion.create({
      data: {
        content: body.content,
        userName: "Sirat User"
      }
    });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}