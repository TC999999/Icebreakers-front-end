import ConversationTabList from "./ConversationTabList";

import type {
  conversation,
  currentConversation,
} from "../types/conversationTypes";

type Props = {
  conversations: conversation[];
  currentConversation: currentConversation;
  handleCurrentConversation: (conversation: conversation) => Promise<void>;
  hidden: boolean;
};

const ConversationTabListTablet: React.FC<Props> = ({
  conversations,
  currentConversation,
  handleCurrentConversation,
  hidden,
}) => {
  return hidden ? null : (
    <div className="modal-transparent" id="conversation-tab-list-tablet">
      <ConversationTabList
        conversations={conversations}
        currentConversation={currentConversation}
        handleCurrentConversation={handleCurrentConversation}
      />
    </div>
  );
};

export default ConversationTabListTablet;
