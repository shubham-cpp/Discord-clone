import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}

const InviteCodePage = async ( {
    params
}: InviteCodePageProps ) => {


    //fetch current profile
    const profile = await currentProfile();

    if(!profile){
        return redirectToSignIn();
    }


    // if there is an invite code in the url
    if(!params.inviteCode){
        return redirect('/')
    }


    // if user is already part of the server then redirect to the server
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members:{
                some:{
                    profileId: profile.id
                }
            }
        }
    });
    // redirecting to the server
    if(existingServer) {
        return redirect(`/servers/${existingServer.id}`)
    }


    // 
    const server = await db.server.update({
        where:{
            inviteCode: params.inviteCode, // update the server with unique invite code
        },
        data:{ // modidy data  
            members:{ // modfiy members
                create:[ // create new memeber with profile ID
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    });

    if(server){
        return redirect(`/servers/${server.id}`)
    }

    return null
}
 
export default InviteCodePage;