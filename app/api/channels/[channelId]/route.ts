import { NextResponse } from "next/server"
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params } : { params: { channelId: string } }
){ 
    try{

        const profile = await currentProfile();

        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthrized", { status: 401 })
        }

        if(!serverId){
            return new NextResponse("Server ID not found", { status: 400 })
        }

        if(!params.channelId){
            return new NextResponse("Channel ID not found", { status: 400 })
        }


        const server = await db.server.update({
            where:{
                id: serverId,
                members: {
                    some:{
                        profileId: profile.id,
                        role:{
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                channels:{
                    delete:{
                        id: params.channelId,
                        name:{
                            not: "general",
                        }
                    }
                }
            }
        });


        return NextResponse.json(server)
        

    }catch(err){
        console.log("[Channel_ID_DELETE]", err)
        return new NextResponse("Internal Error", { status: 500 })
    }
}