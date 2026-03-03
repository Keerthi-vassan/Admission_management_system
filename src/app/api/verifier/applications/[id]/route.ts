import { NextResponse } from "next/server";
import { auth } from "@root/auth";
import {prisma} from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "VERIFIER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify this verifier is assigned to this application
    const assignment = await prisma.assignment.findFirst({
      where: {
        applicationId: id,
        verifierId: session.user.id,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "You are not assigned to this application" },
        { status: 403 }
      );
    }

    // Fetch full application details
    const application = await prisma.studentProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        documents: {
          orderBy: {
            uploadedAt: "asc",
          },
        },
        assignments:{
            include:{
                verifier:{
                    select:{
                        name : true,
                        email : true,
                    }
                },
                assigner:{
                    select:{
                        name : true,
                        email : true,
                    }
                }
            },
            orderBy:{
                assignedAt : "desc",
            },
            take:1
        }
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Transform data
    const transformedApplication = {
      id: application.id,
      name: application.name,
      dateOfBirth: application.dateOfBirth.toISOString(),
      contactNumber: application.contactNumber,
      guardianName: application.guardianName,
      guardianNumber: application.guardianNumber,
      guardianEmail: application.guardianEmail,
      aadharNumber: application.aadharNumber,
      religion: application.religion,
      casteCategory: application.casteCategory,
      branchAllotted: application.branchAllotted,
      seatAllotmentSource: application.seatAllotmentSource,
      permanentAddress: application.permanentAddress,
      state: application.state,
      bloodGroup: application.bloodGroup,
      remarksFromStudent: application.remarksFromStudent,
      applicationStatus: application.applicationStatus,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
      documents: application.documents.map((doc) => ({
        id: doc.id,
        documentType: doc.documentType,
        fileUrl: doc.fileUrl,
        fileName: doc.fileName,
        status: doc.status,
        uploadedAt: doc.uploadedAt.toISOString(),
      })),
      assignment:application.assignments[0]?{
        assignedBy :{
            name : application.assignments[0].assigner.name,
            email : application.assignments[0].assigner.email
        },
        assignedAt: application.assignments[0].assignedAt.toISOString(),
      }:null,
    };

    return NextResponse.json({ application: transformedApplication });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}