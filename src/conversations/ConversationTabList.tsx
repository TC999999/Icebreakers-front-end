import React from "react";
import type { Conversation } from "../types/conversationTypes";
import ConversationTab from "./ConversationTab";
import "../styles/conversations/ConversationTabList.scss";
import ConversationTabLIstSkeleton from "./skeletons/ConversationTabLIstSkeleton";

type Props = {
  conversations: Conversation[];
  currentConversationID: string;
  loadingConversations: boolean;
  focusable: boolean;
  handleCurrentConversation: (conversation: Conversation) => Promise<void>;
  handleNavigateTabs: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
};

// reusable component for showing a list of conversation tabs (to show for both widescreen and
// tablet screen)
const ConversationTabList: React.FC<Props> = ({
  conversations,
  currentConversationID,
  loadingConversations,
  focusable,
  handleCurrentConversation,
  handleNavigateTabs,
  handleMouseEnter,
}) => {
  return (
    <div
      className="conversation-tabs"
      onKeyDown={handleNavigateTabs}
      onMouseEnter={handleMouseEnter}
      tabIndex={focusable ? 0 : -1}
    >
      {conversations.length > 0 && !loadingConversations && (
        <>
          {conversations.map((c) => {
            return (
              <ConversationTab
                key={`conversation-${c.id}`}
                conversation={c}
                selected={currentConversationID === c.id}
                handleCurrentConversation={handleCurrentConversation}
              />
            );
          })}
        </>
      )}

      {conversations.length === 0 && loadingConversations && (
        <ConversationTabLIstSkeleton cards={8} />
      )}
    </div>
  );
};

export default ConversationTabList;
