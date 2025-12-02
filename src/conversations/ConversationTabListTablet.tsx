import ConversationTabList from "./ConversationTabList";
import type {
  conversation,
  currentConversation,
} from "../types/conversationTypes";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  conversations: conversation[];
  currentConversation: currentConversation;
  handleCurrentConversation: (conversation: conversation) => Promise<void>;
  show: boolean;
  toggleTabletConversationTabs: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

// Reusable react component for list of left hand conversation tabs for changing viewed messages
const ConversationTabListTablet: React.FC<Props> = ({
  conversations,
  currentConversation,
  handleCurrentConversation,
  show,
  toggleTabletConversationTabs,
}) => {
  return show ? (
    <div className="modal-transparent" id="tab-list-tablet">
      <div>
        <button
          type="button"
          title="Cancel"
          className="cancel-button"
          onClick={toggleTabletConversationTabs}
        >
          <FaArrowLeft />
        </button>
      </div>

      <ConversationTabList
        conversations={conversations}
        currentConversation={currentConversation}
        handleCurrentConversation={handleCurrentConversation}
      />
    </div>
  ) : null;
};

export default ConversationTabListTablet;
