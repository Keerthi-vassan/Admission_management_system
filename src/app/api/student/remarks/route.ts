import { NextResponse } from "next/server";
import { auth } from "@root/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find student's application
    const studentProfile = await prisma.studentProfile.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 },
      );
    }

    // Fetch remarks for this student's application
    const remarks = await prisma.remark.findMany({
      where: {
        applicationId: studentProfile.id,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ remarks });
  } catch (error) {
    console.error("Error fetching student remarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch remarks" },
      { status: 500 },
    );
  }
}
