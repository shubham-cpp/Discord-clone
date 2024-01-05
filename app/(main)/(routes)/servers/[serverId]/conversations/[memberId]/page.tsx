import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { getOrCreateConversation } from "@/lib/conversation";

import { ChatHeader } from "@/components/chat/chat-header";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    }
}

const MemberIdPage = async ({
    params
}: MemberIdPageProps ) => {

    const profile = await currentProfile();

    if(!profile){
        return redirectToSignIn();
    }

    const currentMember = await db.member.findFirst({
        where:{
            serverId: params.serverId,
            profileId: profile.id
        },
        include:{
            profile: true
        }
    }) 


    if(!currentMember) {
        return redirect('/')
    }


    // currently logged in user and member that user has clicked will be in the conversation
    const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

    if(!conversation){
        return redirect(`/servers/${params.serverId}`)
    }

    const { memberOne, memberTwo } = conversation;

    // compare member one and memeber two look at their profile id and if it matched our current profile id we are picking opposite member
    const otherMemebr = memberOne.profileId === profile.id ? memberTwo : memberOne



    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader 
                imageUrl={otherMemebr.profile?.imageUrl}
                name={otherMemebr.profile?.name}
                serverId={params.serverId}
                type="conversation"
            />

            <ChatMessages 
                member={currentMember}
                name={otherMemebr.profile.name}
                chatId={conversation.id}
                type={"conversation"}
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversationId: conversation.id
                }}
            />
            <ChatInput 
                name={otherMemebr.profile.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{
                    conversationId: conversation.id
                }}
            />
        </div> 
    );
}
 
export default MemberIdPage;