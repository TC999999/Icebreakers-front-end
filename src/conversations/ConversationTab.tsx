import type { conversation } from "../types/conversationTypes";
import "../styles/conversations/ConversationTab.scss";
import createDate from "../helpers/createDate";

type Props = {
  conversation: conversation;
  selected: boolean;
  handleCurrentConversation: (conversation: conversation) => void;
};

const ConversationTab: React.FC<Props> = ({
  conversation,
  selected,
  handleCurrentConversation,
}) => {
  return (
    <div
      onClick={() => handleCurrentConversation(conversation)}
      className={`conversation-tab ${selected ? "selected" : ""}`}
    >
      <p>
        {conversation.title.length > 0
          ? conversation.title
          : conversation.otherUser}
        {conversation.unreadMessages > 0 && (
          <span className="unread-messages-count">
            {conversation.unreadMessages}
          </span>
        )}
      </p>
      <p>{createDate(conversation.lastUpdatedAt, "short")}</p>
    </div>
  );
};

export default ConversationTab;
