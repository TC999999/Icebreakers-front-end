import "../styles/conversations/ConversationLoading.scss";
import { FaHourglass } from "react-icons/fa6";

const ConversationLoading = () => {
  return (
    <div id="conversation-messages-loading-window">
      <div id="conversation-messages-loading-box">
        <div className="box-text" id="conversation-messages-loading-message">
          <div>
            Loading Messages
            <span id="ellipses">
              <span className="ellipsis" id="ellipsis-1">
                .
              </span>
              <span className="ellipsis" id="ellipsis-2">
                .
              </span>
              <span className="ellipsis" id="ellipsis-3">
                .
              </span>
            </span>
          </div>
        </div>
        <div className="box-text" id="loading-hourglass">
          <FaHourglass />
        </div>
      </div>
    </div>
  );
};

export default ConversationLoading;
