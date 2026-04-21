import ConversationTabList from "./ConversationTabList";
import type { Conversation } from "../types/conversationTypes";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  conversations: Conversation[];
  currentConversationID: string;
  loadingConversations: boolean;
  focusable: boolean;
  handleCurrentConversation: (conversation: Conversation) => Promise<void>;
  toggleTabletConversationTabs: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;

  handleNavigateTabs: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
};

// Reusable react component for list of left hand conversation tabs for changing viewed messages
const ConversationTabListTablet: React.FC<Props> = ({
  conversations,
  currentConversationID,
  loadingConversations,
  focusable,
  handleCurrentConversation,
  toggleTabletConversationTabs,
  handleMouseEnter,
  handleNavigateTabs,
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
        focusable={focusable}
        handleCurrentConversation={handleCurrentConversation}
        handleMouseEnter={handleMouseEnter}
        handleNavigateTabs={handleNavigateTabs}
      />
    </div>
  );
};

export default ConversationTabListTablet;
