import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

// IS LINE KO RAKHEIN
import { authOptions } from "@/lib/auth"; 

// IS LINE KO DELETE KAR DEIN (Ye error ki wajah hai)
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

// 1. PRISMA CLIENT SETUP
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


// 2. GET: Fetch History
export async function GET() {
  try {
    const session = await getServerSession(authOptions); // authOptions added
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await prisma.chat.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(chats);
  } catch (error: any) {
    console.error("GET Error:", error.message);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}

// 3. POST: AI Response & Saving
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions); // authOptions added
    if (!session?.user?.email) {
      return NextResponse.json({ answer: "Meherbani karke pehle login karein." }, { status: 401 });
    }

    const { prompt, sessionId } = await req.json();
    
    // User fetch
    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    
    if (!user) return NextResponse.json({ answer: "User profile nahi mili." }, { status: 404 });

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ answer: "API Key missing in .env!" }, { status: 500 });

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: `You are Sirat AI. Every answer MUST start with a relevant Quranic Verse or Sahih Hadith reference if availale. 
      Maintain an extremely respectful tone. Always include 'Wallahu A'lam' at the end of fatwa-related queries.`
    });

    let history: any[] = [];
    if (sessionId) {
      const existingChat = await prisma.chat.findUnique({ where: { id: sessionId } });
      if (existingChat) {
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
    console.error("POST Error Details:", error.message);
    return NextResponse.json({ 
      answer: "Error: " + (error.message || "Something went wrong.") 
    }, { status: 500 });
  }
}

// 4. DELETE: History Cleanup
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!session || !id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.chat.delete({ where: { id } });
    return NextResponse.json({ message: "Chat deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}