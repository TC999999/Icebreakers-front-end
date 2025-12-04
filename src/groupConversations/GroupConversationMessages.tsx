import "../styles/groupConversations/GroupConversationMessages.scss";
import type {
  newConversationMessage,
  conversationMessage,
} from "../types/conversationTypes";
import ConversationMessageBubble from "../conversations/ConversationMessageBubble";

type Props = {
  selctedGroup: string;
  messageInput: newConversationMessage;
  messages: conversationMessage[];
  handleMessage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: (e: React.FormEvent) => void;
};

// react component showing all messages in a single group conversation
const GroupConversationMessages: React.FC<Props> = ({
  selctedGroup,
  messageInput,
  messages,
  handleMessage,
  handleSend,
}) => {
  return (
    <div id="group-conversation-messages">
      <div id="message-window">
        {messages.map((message) => (
          <ConversationMessageBubble
            key={message.id}
            conversationMessage={message}
          />
        ))}
      </div>
      <div id="message-input">
        <form className="form-div" onSubmit={handleSend}>
          <textarea
            name="content"
            id="content"
            className="form-input"
            placeholder="Type Your Message Here"
            value={messageInput.content}
            onChange={handleMessage}
            disabled={selctedGroup.length === 0}
          ></textarea>

          <div id="send">
            <button
              className="submit-button"
              disabled={selctedGroup.length === 0}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupConversationMessages;
