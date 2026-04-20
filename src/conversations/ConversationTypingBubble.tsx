import "../styles/conversations/ConversationTypingBubble.scss";

type Props = { selected: boolean };

// bubble that appears in a single tab in the direct conversation tab list
// whenever another user is typing a message to the current user
const ConversationTypingBubble: React.FC<Props> = ({ selected }) => {
  return (
    <div className={`conversation-typing-bubble ${selected && "selected"}`}>
      <div id="ellipses">
        <span className="ellipsis" id="ellipsis-1">
          .
        </span>
        <span className="ellipsis" id="ellipsis-2">
          .
        </span>
        <span className="ellipsis" id="ellipsis-3">
          .
        </span>
      </div>
    </div>
  );
};

export default ConversationTypingBubble;
