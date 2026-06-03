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

// FIXED DYNAMIC CORS LAYER: Is single utility function se CORS bypass secure kiya hai
const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get('origin') || '*';
  
  return {
    'Access-Control-Allow-Origin': origin, 
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true', 
  };
};

// CLEANED OPTIONS ROUTE: Iske ilawa poori file mein ab koi duplicate OPTIONS route nahi hai
export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

// ================= GET: FETCH USER-SPECIFIC HISTORY =================
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized access detected." }, { status: 401, headers: getCorsHeaders(req) });
    }

    const email = session.user.email;
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user && process.env.NODE_ENV === "development") {
      user = await prisma.user.create({
        data: { name: session.user.name || "Momin Seeker", email: email }
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User profile record not found." }, { status: 404, headers: getCorsHeaders(req) });
    }

    const chats = await prisma.chat.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    const structuredChats = chats.map(c => ({
      id: c.id,
      title: c.title,
      messages: c.messages || [],
      createdAt: c.createdAt,
      userEmail: email 
    }));
    
    return NextResponse.json(structuredChats, { headers: getCorsHeaders(req) });
  } catch (error: any) {
    console.error("SERVER GET ERROR:", error.message);
    return NextResponse.json({ error: "Database exception: " + error.message }, { status: 500, headers: getCorsHeaders(req) });
  }
}

// ================= POST: CREATE/UPDATE SESSION EXECUTION =================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { prompt, sessionId, userEmail } = body;

    const verifiedEmail = session?.user?.email || userEmail;

    if (!verifiedEmail) {
      return NextResponse.json({ error: "Authentication credentials required." }, { status: 401, headers: getCorsHeaders(req) });
    }

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt cannot be empty" }, { status: 400, headers: getCorsHeaders(req) });
    }
    
    let user = await prisma.user.findUnique({ where: { email: verifiedEmail } });
    if (!user && process.env.NODE_ENV === "development") {
      user = await prisma.user.create({
        data: { name: session?.user?.name || "Momin Seeker", email: verifiedEmail }
      });
    }

    if (!user) return NextResponse.json({ error: "User profile missing" }, { status: 404, headers: getCorsHeaders(req) });

    if (sessionId && sessionId !== 'non-existent' && !sessionId.startsWith('session-') && !sessionId.startsWith('mock-')) {
      const chatToCheck = await prisma.chat.findUnique({ where: { id: sessionId } });
      if (chatToCheck && chatToCheck.userId !== user.id) {
        return NextResponse.json({ error: "Access Denied: Conversation ownership mismatch." }, { status: 403, headers: getCorsHeaders(req) });
      }
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Gemini API Key missing in env!" }, { status: 500, headers: getCorsHeaders(req) });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: `You are Sirat AI. Every answer MUST start with a relevant Quranic Verse or Sahih Hadith reference if available using the absolute pattern [Surah:Ayah] like [2:153] when citing. 
      Maintain an extremely respectful tone. Always include 'Wallahu A'lam' at the end of fatwa-related queries.`
    });

    let history: any[] = [];
    if (sessionId && sessionId !== 'non-existent' && !sessionId.startsWith('session-') && !sessionId.startsWith('mock-')) {
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
    if (sessionId && sessionId !== 'non-existent' && !sessionId.startsWith('session-') && !sessionId.startsWith('mock-')) {
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
      createdAt: savedChat.createdAt,
      userEmail: verifiedEmail 
    }, { headers: getCorsHeaders(req) });

  } catch (error: any) {
    console.error("SERVER POST ERROR:", error.message);
    return NextResponse.json({ error: "Runtime execution fault: " + error.message }, { status: 500, headers: getCorsHeaders(req) });
  }
}

// ================= DELETE: CONVERSATION SHREDDER GATE =================
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized request" }, { status: 401, headers: getCorsHeaders(req) });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Session ID required" }, { status: 400, headers: getCorsHeaders(req) });

    const chatToDelete = await prisma.chat.findUnique({ where: { id } });
    if (!chatToDelete) {
      return NextResponse.json({ error: "Target thread entry not found." }, { status: 404, headers: getCorsHeaders(req) });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || chatToDelete.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden cross-user data manipulation execution." }, { status: 403, headers: getCorsHeaders(req) });
    }

    await prisma.chat.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Chat deleted permanently." }, { headers: getCorsHeaders(req) });
  } catch (error: any) {
    console.error("SERVER DELETE ERROR:", error.message);
    return NextResponse.json({ error: "Delete runtime failed: " + error.message }, { status: 500, headers: getCorsHeaders(req) });
  }
}