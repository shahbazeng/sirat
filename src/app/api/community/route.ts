import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
    // Yahan JSON object return karain jismein 'posts' key ho
    return NextResponse.json({ posts: posts }); 
  } catch (e) {
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const post = await prisma.post.create({
    data: {
      content: body.content,
      image: body.image,
      userId: session.user.id // <-- Ye user ko post se link kar dega
    }
  });
  return NextResponse.json(post);
}


