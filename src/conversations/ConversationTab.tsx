import type { conversation } from "../types/conversationTypes";
import { DateTime } from "luxon";
import "../styles/ConversationTab.scss";

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
  let newDate = DateTime.fromISO(conversation.lastUpdatedAt).toFormat(
    "MM/dd/yy, h:mm a"
  );
  return (
    <div
      onClick={() => handleCurrentConversation(conversation)}
      className={`conversation-tab ${selected ? "selected" : ""}`}
    >
      <p>
        {conversation.title}{" "}
        {conversation.unreadMessages > 0 && (
          <span className="unread-messages-count">
            {conversation.unreadMessages}
          </span>
        )}
      </p>
      <p>{newDate}</p>
    </div>
  );
};

export default ConversationTab;
