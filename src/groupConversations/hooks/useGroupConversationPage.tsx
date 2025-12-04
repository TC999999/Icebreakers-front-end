import { useState, useEffect, useCallback, useRef } from "react";
import { useAppSelector } from "../../features/hooks";
import type { groupTab } from "../../types/groupTypes";
import type { groupUserTab } from "../../types/userTypes";
import type {
  conversationMessage,
  newConversationMessage,
} from "../../types/conversationTypes";
import { useSearchParams } from "react-router-dom";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import socket from "../../helpers/socket";

const useGroupConversationPage = () => {
  const username = useAppSelector((store) => store.user.user?.username);

  const initialMessageInput = useRef<newConversationMessage>({ content: "" });

  const [searchParams, setSearchParams] = useSearchParams();
  const [groupTabs, setGroupTabs] = useState<groupTab[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [currentUsers, setCurrentUsers] = useState<groupUserTab[]>([]);
  const [currentMessages, setCurrentMessages] = useState<conversationMessage[]>(
    []
  );
  const [messageInput, setMessageInput] = useState<newConversationMessage>(
    initialMessageInput.current
  );

  // on initial render get a list of all the current user's groups and sets them in state, if there
  // is a group id set in state, gets all other users and messages and sets them in state
  useEffect(() => {
    const getGroupTabs = async () => {
      const id = searchParams.get("id");
      if (username) {
        const groups = await groupConversationsAPI.getGroupTabs(username);
        setGroupTabs(groups);
      }
      if (id && username) {
        setSelectedGroup(id);
        const { users, messages } =
          await groupConversationsAPI.getGroupMessages(username, id);

        socket.emit("isOnlineGroup", users, (newUsers: groupUserTab[]) => {
          setCurrentUsers(newUsers);
        });

        setCurrentMessages(messages);
      }
    };

    getGroupTabs();
  }, []);

  // when a user logs in or logs out of app, updates users state showing if that user is
  // online or offline respectively
  useEffect(() => {
    socket.on("isOnline", ({ user, isOnline }) => {
      console.log(user, isOnline);
      let newUsers = currentUsers.map((u) =>
        u.username === user ? { ...u, isOnline } : u
      );

      setCurrentUsers(newUsers);
    });

    return () => {
      socket.off("isOnline");
    };
  }, [currentUsers]);

  const changeSelectedTab = useCallback(
    async (id: string) => {
      setSelectedGroup(id);
      setSearchParams({ id });
      if (username) {
        const { users, messages } =
          await groupConversationsAPI.getGroupMessages(username, id);
        socket.emit("isOnlineGroup", users, (newUsers: groupUserTab[]) => {
          setCurrentUsers(newUsers);
        });
        setCurrentMessages(messages);
      }
    },
    [selectedGroup, currentUsers]
  );

  const handleMessage = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setMessageInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log(messageInput);
      const id = searchParams.get("id");
      if (username && id) {
        const message = await groupConversationsAPI.createGroupMessage(
          username,
          id,
          messageInput
        );
        console.log(message);
        setMessageInput(initialMessageInput.current);
        setCurrentMessages((prev) => [...prev, message]);
      }
    },
    [messageInput, selectedGroup, currentMessages]
  );

  return {
    groupTabs,
    messageInput,
    selectedGroup,
    currentUsers,
    currentMessages,
    handleMessage,
    handleSend,
    changeSelectedTab,
  };
};

export default useGroupConversationPage;
