import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.community.findMany();
    return NextResponse.json(data || []); // Empty array agar data na ho
  } catch (e) {
    return NextResponse.json([], { status: 200 }); // Crash na ho, bas empty bheje
  }
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();
    const data = await prisma.community.create({ data: { name, description } });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}