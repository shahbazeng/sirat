import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PATCH: Role Change
export async function PATCH(req: Request) {
  try {
    const { userId, role } = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

// DELETE: Remove User
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    
    if (!userId) return NextResponse.json({ error: "ID missing" }, { status: 400 });

    await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
} 




