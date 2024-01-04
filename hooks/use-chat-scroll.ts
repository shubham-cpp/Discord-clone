import { useEffect, useState } from "react";

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    endRef: React.RefObject<HTMLDivElement>,
    shouldLoadMore: boolean;
    loadMoreMessages: () => void;
    count: number;
};

export const useChatScroll = ({
    chatRef,
    endRef,
    shouldLoadMore,
    loadMoreMessages,
    count,    
}: ChatScrollProps) => {

    const [ hasInitalized, setHasInitalized ] = useState(false);

    useEffect(() => {
        const topDiv = chatRef?.current;

        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if(scrollTop === 0 && shouldLoadMore){
                loadMoreMessages()
            }
        }

        topDiv?.addEventListener("scroll", handleScroll);

        return () => {
            topDiv?.removeEventListener("scroll", handleScroll)
        }

    }, [ shouldLoadMore, loadMoreMessages, chatRef ])

    useEffect(( ) => {
        
        const endDiv = endRef?.current;

        const topDiv = chatRef.current;

        const shouldAutoScroll = () => {
            if(!hasInitalized && endDiv){
                setHasInitalized(true);
                return true
            }

            if(!topDiv){
                return false
            }

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

            return distanceFromBottom <= 100;
        }


        if(shouldAutoScroll()){
            setTimeout(() => {
                endRef.current?.scrollIntoView({
                    behavior: "smooth",
                })
            }, 100)
        }

    }, [endRef, chatRef, count, hasInitalized])
} 