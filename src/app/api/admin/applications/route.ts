import {auth} from "@root/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const session = await auth();

        if(!session?.user){
            return NextResponse.json(
                {error : "Unauthorized"},
                {status: 401}
            );
        }

        if(session.user.role !== "ADMIN"){
            return NextResponse.json(
                {error : "Forbidden - admin access required"},
                {status: 403},
            );
        }
        
        const applications = await prisma.studentProfile.findMany({
            include : {
                user : {
                    select :{
                        email : true,
                        createdAt : true,
                    },
                },
                documents : {
                    select :{
                        id : true,
                        documentType : true ,
                        status : true,
                    }
                },
            },
            orderBy : {
                createdAt : "desc"
            }
        });

        return NextResponse.json({applications});
    }
    catch(error){
        console.log("error fetching applications : " ,error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}