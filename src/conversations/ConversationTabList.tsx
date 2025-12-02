import React from "react";
import type {
  conversation,
  currentConversation,
} from "../types/conversationTypes";
import ConversationTab from "./ConversationTab";
import "../styles/conversations/ConversationTabList.scss";

type Props = {
  conversations: conversation[];
  currentConversation: currentConversation;
  handleCurrentConversation: (conversation: conversation) => Promise<void>;
};

// reusable component for showing a list of conversation tabs (to show for both widescreen and
// tablet screen)
const ConversationTabList: React.FC<Props> = ({
  conversations,
  currentConversation,
  handleCurrentConversation,
}) => {
  return (
    <div className="conversation-tabs">
      {conversations.map((c) => {
        return (
          <ConversationTab
            key={`conversation-${c.id}`}
            conversation={c}
            selected={currentConversation.id === c.id}
            handleCurrentConversation={handleCurrentConversation}
          />
        );
      })}
    </div>
  );
};

export default ConversationTabList;
