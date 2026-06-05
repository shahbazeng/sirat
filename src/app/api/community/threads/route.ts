import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.thread.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();
    const data = await prisma.thread.create({ 
      data: { title, content, userId: "clsd-default-id" } // Temporary ID
    });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}