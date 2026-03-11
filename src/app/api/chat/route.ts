import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. GET: Database se history mangwana
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const chats = await prisma.chat.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(chats);
  } catch (error) {
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}

// 2. POST: Gemini Response & Saving
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ answer: "Meherbani karke pehle login karein." }, { status: 401 });
    }

    const { prompt, sessionId } = await req.json();
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ answer: "User nahi mila." }, { status: 404 });

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ answer: "API Key missing!" }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      // NOTE: Using Backticks (`) for multi-line string support
      systemInstruction: `You are Sirat AI. Every answer MUST start with a relevant Quranic Verse or Sahih Hadith reference if available. 
      If a topic is controversial, provide the majority view (Jumhoor) and maintain an extremely respectful tone. 
      Always include 'Wallahu A'lam' at the end of fatwa-related queries.`
    });

    let history = [];
    if (sessionId) {
      const existingChat = await prisma.chat.findUnique({ where: { id: sessionId } });
      if (existingChat) {
        history = (existingChat.messages as any[]).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));
      }
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    const newUserMsg = { role: 'user', content: prompt };
    const newAiMsg = { role: 'ai', content: text };

    let savedChat;
    if (sessionId) {
      const existingChat = await prisma.chat.findUnique({ where: { id: sessionId } });
      const updatedMessages = [...(existingChat?.messages as any[] || []), newUserMsg, newAiMsg];
      
      savedChat = await prisma.chat.update({
        where: { id: sessionId },
        data: { messages: updatedMessages }
      });
    } else {
      savedChat = await prisma.chat.create({
        data: {
          title: prompt.slice(0, 40) + "...",
          messages: [newUserMsg, newAiMsg],
          userId: user.id
        }
      });
    }

    return NextResponse.json({ 
      id: savedChat.id, 
      answer: text,
      messages: savedChat.messages 
    });

  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ answer: "Error: " + (error.message || "Kuch masla hua.") }, { status: 500 });
  }
}

// 3. DELETE: Chat History mitaane ke liye
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!session || !id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.chat.delete({ where: { id } });
    return NextResponse.json({ message: "Chat deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}