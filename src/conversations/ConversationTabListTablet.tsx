import ConversationTabList from "./ConversationTabList";
import type { conversation } from "../types/conversationTypes";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  conversations: conversation[];
  currentConversationID: string;
  loadingConversations: boolean;
  handleCurrentConversation: (conversation: conversation) => Promise<void>;
  toggleTabletConversationTabs: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

// Reusable react component for list of left hand conversation tabs for changing viewed messages
const ConversationTabListTablet: React.FC<Props> = ({
  conversations,
  currentConversationID,
  loadingConversations,
  handleCurrentConversation,
  toggleTabletConversationTabs,
}) => {
  return (
    <div className="modal-transparent" id="tab-list-tablet">
      <div>
        <button
          type="button"
          title="Cancel"
          className="cancel-button"
          aria-label="Cancel and Go Back"
          onClick={toggleTabletConversationTabs}
        >
          <FaArrowLeft />
        </button>
      </div>

      <ConversationTabList
        conversations={conversations}
        currentConversationID={currentConversationID}
        loadingConversations={loadingConversations}
        handleCurrentConversation={handleCurrentConversation}
      />
    </div>
  );
};

export default ConversationTabListTablet;
