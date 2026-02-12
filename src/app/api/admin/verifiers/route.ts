import { NextResponse } from "next/server";
import { auth } from "@root/auth";
import { prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const verifiers = await prisma.user.findMany({
      where: {
        role: "VERIFIER",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ verifiers });
  } catch (error) {
    console.error("Error fetching verifiers:", error);
    return NextResponse.json(
      { error: "Failed to fetch verifiers" },
      { status: 500 }
    );
  }
}