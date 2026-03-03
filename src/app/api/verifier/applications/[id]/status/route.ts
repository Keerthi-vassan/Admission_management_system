import { NextResponse } from "next/server";
import {auth} from "@root/auth"
import {prisma} from "@/lib/prisma"
import { error } from "console";
import { Application, StudentProfile } from '../../../../../../types/index';
import { ApplicationStatus } from "@prisma/client";

export async function PATCH(request : Request , {params} : {params : Promise<{id:string}> }){
    try{
        const session = await auth();

        if(!session?.user || session.user.role != "VERIFIER"){
            return NextResponse.json({error : "Unauthorized"}, {status : 401});
        }

        const {id} = await params;
        const body = await request.json();
        const {status} = body ;

        const validStatuses = ["VERIFIED","REJECTED"];
        if(!status || !validStatuses.includes(status)){
            return NextResponse.json(
                {error : "Invalid status . Must be VERIFIED or REJECTED"},
                { status : 400 }
            );
        }

        const assignment = await prisma.assignment.findFirst({
            where:{
                applicationId : id,
                verifierId : session.user.id,
            },
        });

        if(!assignment){
            return NextResponse.json(
                {error : "You are not assigned to this application"},
                {status : 403},
            );
        }
        
        const currentApplication = await prisma.studentProfile.findUnique({
            where : {id},
            select : {applicationStatus : true}
        });

        if(currentApplication?.applicationStatus == "VERIFIED" || currentApplication?.applicationStatus == "REJECTED"){
            return NextResponse.json(
                {error : "application status is final and cannot be changed"},
                {status : 400 },
            );
        }

        const updatedApplication = await prisma.studentProfile.update({
            where : {id},
            data : {
                 applicationStatus : status,
            },
            select:{
                id : true ,
                name : true,
                 applicationStatus: true,
            },
        });

        return NextResponse.json(
            {message : `Application is marked as ${status}`,
             application : updatedApplication,
            }
        );
    }catch(error){
        console.error("Error updating application status : " , error);
        return NextResponse.json(
            {error : "Failed to update the application status"},
            {status : 500}
        );
    }
}