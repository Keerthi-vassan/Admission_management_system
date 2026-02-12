import { NextResponse } from "next/server";
import { auth } from "@root/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationIds, verifierId } = body;

    // Validate inputs
    if ( !applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return NextResponse.json(
        { error: "No applications selected" },
        { status: 400 },
      );
    }

    if (!verifierId) {
      return NextResponse.json(
        { error: "No verifier selected" },
        { status: 400 },
      );
    }

    // Verify verifier exists and has VERIFIER role
    const verifier = await prisma.user.findUnique({
      where: { id: verifierId },
      select: { role: true, name: true, email: true },
    });

    if (!verifier || verifier.role !== "VERIFIER") {
      return NextResponse.json({ error: "Invalid verifier" }, { status: 400 });
    }

    // Use transaction to ensure atomicity
    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Find existing assignments for these applications
      const existingAssignments = await tx.assignment.findMany({
        where: {
          applicationId: { in: applicationIds },
        },
        select: {
          id: true,
          applicationId: true,
          verifierId: true,
          verifier: {
            select: { name: true, email: true },
          },
        },
      });

      // Separate into: apps that need reassignment vs new assignments
      const existingAppIds = existingAssignments.map((a) => a.applicationId);
      const newAppIds = applicationIds.filter(
        (id) => !existingAppIds.includes(id),
      );

      // Apps being reassigned to same verifier (skip these)
      const sameVerifierAppIds = existingAssignments
        .filter((a) => a.verifierId === verifierId)
        .map((a) => a.applicationId);

      // Apps being reassigned to different verifier (delete old, create new)
      const reassignAppIds = existingAssignments
        .filter((a) => a.verifierId !== verifierId)
        .map((a) => a.applicationId);

      let reassignedCount = 0;
      let createdCount = 0;

      // Delete old assignments for reassignment cases
      if (reassignAppIds.length > 0) {
        await tx.assignment.deleteMany({
          where: {
            applicationId: { in: reassignAppIds },
          },
        });
        reassignedCount = reassignAppIds.length;
      }

      // Create new assignments (both new apps and reassigned apps)
      const appsToAssign = [...newAppIds, ...reassignAppIds];

      if (appsToAssign.length > 0) {
        const created = await tx.assignment.createMany({
          data: appsToAssign.map((appId) => ({
            applicationId: appId,
            verifierId: verifierId,
            assignedBy: session.user.id,
          })),
        });
        createdCount = created.count;

        // Update application statuses to IN_REVIEW
        await tx.studentProfile.updateMany({
          where: {
            id: { in: appsToAssign },
            applicationStatus: "PENDING",
          },
          data: {
            applicationStatus: "IN_REVIEW",
          },
        });
      }

      return {
        createdCount,
        reassignedCount,
        skippedCount: sameVerifierAppIds.length,
        verifierName: verifier.name || verifier.email,
      };
    });

    return NextResponse.json({
      message: "Assignments completed",
      ...result,
    });
  } catch (error) {
    console.error("Error in bulk assignment:", error);
    return NextResponse.json(
      { error: "Failed to assign applications" },
      { status: 500 },
    );
  }
}
