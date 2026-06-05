import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// 1. GET: Saari Baithaks fetch karne ke liye
export async function GET() {
  try {
    const events = await prisma.event.findMany({ 
      include: { organizer: { select: { name: true } } }, 
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// 2. PUT: Nayi Baithak Create karne ke liye
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { title } = await req.json();
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    
    if (!user) return NextResponse.json({ error: "User profile not found" }, { status: 404 });

    const event = await prisma.event.create({
      data: { 
        title, 
        location: "Private Call", 
        date: new Date(), 
        organizerId: user.id 
      }
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}

// 3. POST: RSVP karne ke liye
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { eventId } = await req.json();
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { attendees: { connect: { id: user.id } } }
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: "RSVP update failed" }, { status: 500 });
  }
}