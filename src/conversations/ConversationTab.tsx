import { memo } from "react";
import type { conversation } from "../types/conversationTypes";
import ConversationTypingBubble from "./ConversationTypingBubble";
import "../styles/conversations/ConversationTab.scss";
import createDate from "../helpers/createDate";

type Props = {
  conversation: conversation;
  selected: boolean;
  handleCurrentConversation: (conversation: conversation) => void;
};

// component for conversation tab seen of the left side on conversation list page
const ConversationTab: React.FC<Props> = memo(
  ({ conversation, selected, handleCurrentConversation }) => {
    return (
      <div
        onClick={() => handleCurrentConversation(conversation)}
        className={`conversation-tab ${selected ? "selected" : ""}`}
      >
        <p className="conversation-header">
          {conversation.title.length > 0
            ? conversation.title
            : conversation.otherUser}
          {conversation.unreadMessages > 0 && (
            <span className="unread-messages-count">
              {conversation.unreadMessages}
            </span>
          )}
        </p>
        <div className="latest-message">
          {conversation.isTyping && <ConversationTypingBubble />}

          {conversation.latestMessage && !conversation.isTyping && (
            <p>{conversation.latestMessage}</p>
          )}

          {!conversation.latestMessage && !conversation.isTyping && (
            <p>
              <i>No Messages Yet</i>
            </p>
          )}
        </div>

        <small className="last-updated-at">
          {createDate(conversation.lastUpdatedAt, "short")}
        </small>
      </div>
    );
  }
);

export default ConversationTab;
