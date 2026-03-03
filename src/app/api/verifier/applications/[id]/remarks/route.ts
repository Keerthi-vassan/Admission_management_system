import { NextResponse } from "next/server";
import { auth } from "@root/auth";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { email } from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role != "VERIFIER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const assignment = await prisma.assignment.findFirst({
      where: {
        applicationId: id,
        verifierId: session.user.id,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "You arae not assigned to this application" },
        { status: 403 },
      );
    }

    const remarks = await prisma.remark.findMany({
      where: {
        applicationId: id,
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
    console.error("Error fetchin remarks : ", error);
    return NextResponse.json(
      { error: "failed to fetch remarks" },
      { status: 500 },
    );
  }
}

export async function POST( request: Request, { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role != "VERIFIER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { text } = body;

    if (!text || text.trim().length == 0) {
      return NextResponse.json(
        { error: "Remark textis required" },
        { status: 400 },
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Remark text too long (max 5000 characters)" },
        { status: 400 },
      );
    }

    const assingment = await prisma.assignment.findFirst({
      where: {
        applicationId: id,
        verifierId : session.user.id,
      },
    });

    if (!assingment) {
      return NextResponse.json(
        { error: "You are not assigned tothis application" },
        { status: 403 },
      );
    }

    const remark = await prisma.remark.create({
      data: {
        applicationId: id,
        authorId: session.user.id,
        text: text.trim(),
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
    });

    return NextResponse.json({
        message : "Remark added successfully",
        remark,
    })

  } catch (error) {
    console.error("error creating remark : ",error);
    return NextResponse.json(
        {error : "failed to add remark"},
        {status : 500},
    )
  }
}
