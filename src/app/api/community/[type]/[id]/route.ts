import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request, 
  { params }: { params: { type: string, id: string } }
) {
  try {
    const { type, id } = params;
    
    // Yahan type 'posts' match hona chahiye
    if (type === 'posts') {
      await prisma.post.delete({ where: { id } });
    } else if (type === 'threads') {
      await prisma.thread.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Delete Error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}