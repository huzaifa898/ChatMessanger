'use client';

import { FullConversationType } from "@/types";


interface ConversationListProps {
    initialItems : FullConversationType[];
}
const ConversationList: React.FC<ConversationListProps> = ({
    initialItems
}) =>{

    return(
         <div>
            list
         </div>
    );
}
export default ConversationList;