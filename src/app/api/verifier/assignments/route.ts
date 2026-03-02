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

    if (!session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    type AssignedApplicationRow = {
      id: string;
      name: string;
      email: string;
      branchAllotted: string;
      applicationStatus: string;
      createdAt: Date;
      assignedAt: Date;
    };

    // Fetch applications assigned to this verifier
    const rows = await prisma.$queryRaw<AssignedApplicationRow[]>`
      SELECT
        sp."id" AS "id",
        sp."name" AS "name",
        u."email" AS "email",
        sp."branchAllotted" AS "branchAllotted",
        sp."applicationStatus"::text AS "applicationStatus",
        sp."createdAt" AS "createdAt",
        a."assignedAt" AS "assignedAt"
      FROM "Assignment" a
      INNER JOIN "StudentProfile" sp ON sp."id" = a."applicationId"
      INNER JOIN "User" u ON u."id" = sp."userId"
      WHERE a."verifierId" = ${session.user.id}
      ORDER BY a."assignedAt" DESC
    `;

    // Transform to match frontend type
    const applications = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      branchAllotted: row.branchAllotted,
      applicationStatus: row.applicationStatus,
      createdAt: new Date(row.createdAt).toISOString(),
      assignedAt: new Date(row.assignedAt).toISOString(),
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