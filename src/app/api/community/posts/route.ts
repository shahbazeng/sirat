import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({ 
      include: { 
        user: { select: { name: true, image: true } },
        reactions: true,
        comments: true
      },
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// src/app/api/community/route.ts
export async function POST(req: Request) {
  const { title, content, image } = await req.json(); // 'image' yahan se aayegi
  
  const post = await prisma.post.create({
    data: {
      content: content, 
      image: image // <--- Ye field database mein save honi chahiye
    }
  });
  
  return NextResponse.json(post);
}