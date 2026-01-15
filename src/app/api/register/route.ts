import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@root/auth";


// Type for the request body
interface RegistrationData {
  // Basic Info
  name: string;
  dateOfBirth: string;
  contactNumber: string;
  guardianName: string;
  guardianNumber: string;
  guardianEmail: string;
  
  // Academic Info
  aadharNumber: string;
  religion: string;
  casteCategory: "GENERAL" | "GENERAL_EWS" | "OBC_NCL" | "SC" | "ST";
  branchAllotted: string;
  seatAllotmentSource: "JOSSA" | "CSAB";
  permanentAddress: string;
  state: string;
  bloodGroup?: string;
  remarksFromStudent?: string;
  
  // Document URLs
  documentUrls: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse request body
    const data: RegistrationData = await request.json();

    // Validate required fields
    if (!data.name || !data.dateOfBirth || !data.aadharNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already has a profile
    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Application already submitted" },
        { status: 400 }
      );
    }

    // Create StudentProfile with Documents in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create StudentProfile
      const profile = await tx.studentProfile.create({
        data: {
          userId,
          name: data.name,
          dateOfBirth: new Date(data.dateOfBirth),
          contactNumber: data.contactNumber,
          guardianName: data.guardianName,
          guardianNumber: data.guardianNumber,
          guardianEmail: data.guardianEmail,
          aadharNumber: data.aadharNumber,
          religion: data.religion,
          casteCategory: data.casteCategory,
          branchAllotted: data.branchAllotted,
          seatAllotmentSource: data.seatAllotmentSource,
          permanentAddress: data.permanentAddress,
          state: data.state,
          bloodGroup: data.bloodGroup || null,
          remarksFromStudent: data.remarksFromStudent || null,
          applicationStatus: "PENDING",
        },
      });

      // Create Document records for each uploaded file
      const documentPromises = Object.entries(data.documentUrls).map(
        ([docType, fileUrl]) => {
          return tx.document.create({
            data: {
              studentProfileId: profile.id,
              documentType: docType as any,
              fileUrl,
              fileName: fileUrl.split('/').pop() || 'unknown',
              status: "PENDING",
              version: 1,
            },
          });
        }
      );

      await Promise.all(documentPromises);

      return profile;
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      profileId: result.id,
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to submit application",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}