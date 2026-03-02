import { NextResponse } from "next/server";
import { auth } from "@root/auth";
import {prisma} from "@/lib/prisma";
import { Prisma } from "@prisma/client";

 export async function GET() {
   try {
     const session = await auth();
 
     if (!session?.user || session.user.role !== "ADMIN") {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }
 
     // Test database connection first
     try {
       await prisma.$connect();
     } catch (dbError) {
       console.error("Database connection error:", dbError);
       return NextResponse.json(
         { error: "Database connection failed" },
         { status: 500 }
       );
     }
 
    // Fetch applications
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Fetch latest assignment info separately to avoid relying on StudentProfile.assignments relation
    const applicationIds = applications.map((app) => app.id);
    type LatestAssignmentRow = {
      applicationId: string;
      verifierName: string | null;
      verifierEmail: string | null;
    };

    const latestAssignments = applicationIds.length
      ? await prisma.$queryRaw<LatestAssignmentRow[]>(Prisma.sql`
          SELECT DISTINCT ON (a."applicationId")
            a."applicationId",
            u."name" AS "verifierName",
            u."email" AS "verifierEmail"
          FROM "Assignment" a
          INNER JOIN "User" u ON u."id" = a."verifierId"
          WHERE a."applicationId" IN (${Prisma.join(applicationIds)})
          ORDER BY a."applicationId", a."assignedAt" DESC
        `)
      : [];

    const latestAssignmentByApplicationId = new Map<string, { name: string | null; email: string }>();
    for (const assignment of latestAssignments) {
      if (assignment.verifierEmail) {
        latestAssignmentByApplicationId.set(assignment.applicationId, {
          name: assignment.verifierName,
          email: assignment.verifierEmail,
        });
      }
    }

    // Transform data for frontend
    const transformedApplications = applications.map((app) => ({
      id: app.id,
      name: app.name,
      email: app.user.email,
      branchAllotted: app.branchAllotted,
      applicationStatus: app.applicationStatus,
      createdAt: app.createdAt.toISOString(),
      assignedVerifier: latestAssignmentByApplicationId.get(app.id) || null,
    }));

    return NextResponse.json({ applications: transformedApplications });
 } catch (error) {
     console.error("Error fetching applications:", error);
     const errorMessage = error instanceof Error ? error.message : "Unknown error";
     console.error("Error message:", errorMessage);
     return NextResponse.json(
       { error: errorMessage },
       { status: 500 },
     );
   }
}
