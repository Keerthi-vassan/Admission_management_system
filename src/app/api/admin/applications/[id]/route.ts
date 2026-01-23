import { auth } from "@root/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const session = await auth();
    const {id} = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const application = await prisma.studentProfile.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        documents: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application Not Found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.log("Error fetching application : ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
