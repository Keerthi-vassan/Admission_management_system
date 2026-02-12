import { NextResponse } from "next/server";
import { auth } from "@root/auth";
import {prisma}  from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    // Check if user is authenticated and is VERIFIER
    if (!session?.user || session.user.role !== "VERIFIER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch applications assigned to this verifier
    const assignments = await prisma.assignment.findMany({
      where: {
        verifierId: session.user.id,
      },
      include: {
        application: {
          select: {
            id: true,
            name: true,
            branchAllotted: true,
            applicationStatus: true,
            createdAt: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    // Transform to match frontend type
    const applications = assignments.map((assignment) => ({
      id: assignment.application.id,
      name: assignment.application.name,
      email: assignment.application.user.email,
      branchAllotted: assignment.application.branchAllotted,
      applicationStatus: assignment.application.applicationStatus,
      createdAt: assignment.application.createdAt.toISOString(),
      assignedAt: assignment.assignedAt.toISOString(),
    }));

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching verifier assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}