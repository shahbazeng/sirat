import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth"; 

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [];
} 

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient({ log: ['error'] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    let email = "shahbaz@gmail.com"; 

    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      email = session.user.email;
    } else if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user && process.env.NODE_ENV === "development") {
      user = await prisma.user.create({
        data: { name: "Shahbaz Ali", email: email }
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User profile record not found." }, { status: 404, headers: corsHeaders });
    }

    const chats = await prisma.chat.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    const structuredChats = chats.map(c => ({
      id: c.id,
      title: c.title,
      messages: c.messages || [],
      createdAt: c.createdAt
    }));
    
    return NextResponse.json(structuredChats, { headers: corsHeaders });
  } catch (error: any) {
    console.error("SERVER GET ERROR:", error.message);
    return NextResponse.json({ error: "Database exception: " + error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    let email = "shahbaz@gmail.com";

    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      email = session.user.email;
    } else if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { prompt, sessionId } = await req.json();
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt cannot be empty" }, { status: 400, headers: corsHeaders });
    }
    
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user && process.env.NODE_ENV === "development") {
      user = await prisma.user.create({
        data: { name: "Shahbaz Ali", email: email }
      });
    }

    if (!user) return NextResponse.json({ error: "User profile missing" }, { status: 404, headers: corsHeaders });

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Gemini API Key missing in env!" }, { status: 500, headers: corsHeaders });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: `You are Sirat AI. Every answer MUST start with a relevant Quranic Verse or Sahih Hadith reference if available using the absolute pattern [Surah:Ayah] like [2:153] when citing. 
      Maintain an extremely respectful tone. Always include 'Wallahu A'lam' at the end of fatwa-related queries.`
    });

    let history: any[] = [];
    if (sessionId && sessionId !== 'non-existent') {
      const existingChat = await prisma.chat.findUnique({ where: { id: sessionId } });
      if (existingChat && existingChat.messages) {
        history = (existingChat.messages as any[]).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));
      }
    }

    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();

    const newUserMsg = { role: 'user', content: prompt };
    const newAiMsg = { role: 'ai', content: text };

    let savedChat;
    if (sessionId && sessionId !== 'non-existent') {
      const existingChat = await prisma.chat.findUnique({ where: { id: sessionId } });
      const updatedMessages = [...(existingChat?.messages as any[] || []), newUserMsg, newAiMsg];
      
      savedChat = await prisma.chat.update({
        where: { id: sessionId },
        data: { messages: updatedMessages }
      });
    } else {
      savedChat = await prisma.chat.create({
        data: {
          title: prompt.length > 30 ? prompt.slice(0, 30) + "..." : prompt,
          messages: [newUserMsg, newAiMsg],
          userId: user.id
        }
      });
    }

    return NextResponse.json({ 
      id: savedChat.id, 
      title: savedChat.title,
      messages: savedChat.messages,
      createdAt: savedChat.createdAt
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("SERVER POST ERROR:", error.message);
    return NextResponse.json({ error: "Runtime execution fault: " + error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Session ID required" }, { status: 400, headers: corsHeaders });

    await prisma.chat.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Chat deleted" }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("SERVER DELETE ERROR:", error.message);
    return NextResponse.json({ error: "Delete runtime failed: " + error.message }, { status: 500, headers: corsHeaders });
  }
}