import { NextResponse } from "next/server";
import { auth } from "@root/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try{
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        documents: {
          orderBy: { documentType: "asc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "No application found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  }
  catch(error){
    console.error("Profile fetch error : ", error);
    return NextResponse.json(
      { error: "failed to fetch profile" },
      { status: 500 }
    );
  }
}
