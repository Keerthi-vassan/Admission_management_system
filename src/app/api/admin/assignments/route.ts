import { NextResponse } from "next/server";
import { auth } from "@root/auth";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all applications with their assignments
    const applications = await prisma.studentProfile.findMany({
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
        assignments: {
          include: {
            verifier: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            assignedAt: "desc",
          },
          take: 1, // Get most recent assignment only
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data for frontend
    const transformedApplications = applications.map((app) => ({
      id: app.id,
      name: app.name,
      email: app.user.email,
      branchAllotted: app.branchAllotted,
      applicationStatus: app.applicationStatus,
      createdAt: app.createdAt.toISOString(),
      assignedVerifier: app.assignments[0]?.verifier || null,
    }));

    return NextResponse.json({ applications: transformedApplications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
