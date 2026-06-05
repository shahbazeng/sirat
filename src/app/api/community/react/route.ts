import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { PrismaClient, ReactionType } from "@prisma/client";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient({ log: ['error'] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { postId, type } = await req.json(); // type: SUBHANALLAH, JAZAKALLAH, etc.

    if (!postId || !type) {
      return NextResponse.json({ error: "Invalid reaction payload parameter matrix" }, { status: 400, headers: corsHeaders });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User missing" }, { status: 404, headers: corsHeaders });

    // Check if the user already reacted to this specific post
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        postId_userId: { postId, userId: user.id }
      }
    });

    if (existingReaction) {
      // If same reaction clicked again -> Delete it (Toggle off)
      if (existingReaction.type === type) {
        await prisma.reaction.delete({ where: { id: existingReaction.id } });
        return NextResponse.json({ action: "REMOVED", targetId: id }, { headers: corsHeaders });
      } else {
        // If different reaction clicked -> Update type
        const updatedReaction = await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type: type as ReactionType }
        });
        return NextResponse.json({ action: "UPDATED", data: updatedReaction }, { headers: corsHeaders });
      }
    }

    // Pure Fresh entry register
    const newReaction = await prisma.reaction.create({
      data: {
        type: type as ReactionType,
        postId: postId,
        userId: user.id
      }
    });

    return NextResponse.json({ action: "CREATED", data: newReaction }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("COMMUNITY REACTION ERROR:", error.message);
    return NextResponse.json({ error: "Reaction handling execution error: " + error.message }, { status: 500, headers: corsHeaders });
  }
} 





