import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request, 
  context: { params: Promise<{ type: string, id: string }> } // params ko Promise bana diya
) {
  try {
    // params ko await karna zaroori hai
    const { type, id } = await context.params;
    
    if (type === 'posts') {
      await prisma.post.delete({ where: { id } });
    } else if (type === 'threads') {
      await prisma.thread.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Delete Error:", e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}