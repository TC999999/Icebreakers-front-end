import GroupTabList from "./GroupTabList";
import GroupUserTabList from "./GroupUserTabList";
import GroupConversationMessages from "./GroupConversationMessages";
import "../styles/groupConversations/GroupConversationPage.scss";
import useGroupConversationPage from "./hooks/useGroupConversationPage";
import { Link } from "react-router-dom";

const GroupConversationPage = () => {
  const {
    groupTabs,
    scrollRef,
    currentUsers,
    currentMessages,
    selectedGroup,
    messageInput,
    usersTyping,
    changeSelectedTab,
    handleMessage,
    handleSend,
    handleFocus,
    handleBlur,
  } = useGroupConversationPage();
  return (
    <main id="group-conversation-page">
      {selectedGroup.title ? (
        <>
          <h1>
            <Link to={`/groups/${selectedGroup.id}`}>
              {selectedGroup.title}
            </Link>
          </h1>
          <h3>Hosted By {selectedGroup.host}</h3>
        </>
      ) : (
        <>
          <h1>Group Conversations</h1>
          <h3>Please select a group tab from below</h3>
        </>
      )}

      <div id="group-conversation-messaging">
        <GroupTabList
          selectedGroup={selectedGroup}
          groupTabList={groupTabs}
          changeSelectedTab={changeSelectedTab}
        />
        <div id="group-convertation-message-window">
          <GroupUserTabList currentUsers={currentUsers} />
          <GroupConversationMessages
            scrollReference={scrollRef}
            selctedGroup={selectedGroup}
            messages={currentMessages}
            messageInput={messageInput}
            usersTyping={usersTyping}
            handleMessage={handleMessage}
            handleSend={handleSend}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
          />
        </div>
      </div>
    </main>
  );
};

export default GroupConversationPage;
