import { useState, useEffect, useCallback, useRef } from "react";
import { useAppSelector } from "../../features/hooks";
import type { groupTab, selectedGroup } from "../../types/groupTypes";
import type { groupUserTab } from "../../types/userTypes";
import type {
  conversationMessage,
  newConversationMessage,
} from "../../types/conversationTypes";
import type { userTyping } from "../../types/userTypes";
import { useSearchParams } from "react-router-dom";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import socket from "../../helpers/socket";
import { useAppDispatch } from "../../features/hooks";
import {
  setFormLoading,
  setUnreadGroupMessages,
} from "../../features/slices/auth";

// custom react hook for group conversation page; handles all group conversation logic such as
// retrieving initial list of conversations, getting a list of all users and messages for
// those respective groups, and creating new messages
const useGroupConversationPage = () => {
  const username = useAppSelector((store) => store.user.user?.username);
  const dispatch = useAppDispatch();

  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  const initialMessageInput = useRef<newConversationMessage>({ content: "" });

  const [searchParams, setSearchParams] = useSearchParams();
  const [groupTabs, setGroupTabs] = useState<groupTab[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<selectedGroup>({
    id: "",
    title: "",
    host: "",
  });
  const [currentUsers, setCurrentUsers] = useState<groupUserTab[]>([]);
  const [currentMessages, setCurrentMessages] = useState<conversationMessage[]>(
    []
  );
  const [messageInput, setMessageInput] = useState<newConversationMessage>(
    initialMessageInput.current
  );

  const [usersTyping, setUsersTyping] = useState<userTyping>({});

  //for auto scrolling to the bottom of the messages list
  const scrollRef = useRef<HTMLDivElement>(null);

  // on initial render get a list of all the current user's groups and sets them in state, if there
  // is a group id set in state, gets all other users and messages and sets them in state
  useEffect(() => {
    const getGroupTabs = async () => {
      try {
        dispatch(setFormLoading(true));
        const id = searchParams.get("id");
        if (username) {
          const groups = await groupConversationsAPI.getGroupTabs(username);
          setGroupTabs(groups);
        }
        if (id && username) {
          const { users, messages, title, host } =
            await groupConversationsAPI.getGroupMessages(username, id, 0);
          setSelectedGroup({ id, title, host });
          socket.emit("isOnlineGroup", users, (newUsers: groupUserTab[]) => {
            setCurrentUsers(newUsers);
          });

          setCurrentMessages(messages);
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getGroupTabs();
  }, []);

  // auto scrolls to the bottom of the messages list div whenever a new message is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages]);

  // when a user logs in or logs out of app, updates users state showing if that user is
  // online or offline respectively
  useEffect(() => {
    socket.on("isOnline", ({ user, isOnline }) => {
      let newUsers = currentUsers.map((u) =>
        u.username === user ? { ...u, isOnline } : u
      );

      setCurrentUsers(newUsers);
    });

    return () => {
      socket.off("isOnline");
    };
  }, [currentUsers]);

  // when a new group message signal is emitted from another user, adds new message to current
  // message list if id matches selected group id
  useEffect(() => {
    socket.on("groupMessage", ({ message, id }) => {
      if (selectedGroup === id) {
        setCurrentMessages((prev) => [...prev, message]);

        dispatch(setUnreadGroupMessages(-1));
        socket.emit("decreaseUnreadGroupMessages", { id });
      } else {
        setGroupTabs((prev) =>
          prev.map((g) =>
            g.id === id ? { ...g, unreadMessages: g.unreadMessages + 1 } : g
          )
        );
      }
    });

    return () => {
      socket.off("groupMessage");
    };
  }, [selectedGroup, currentMessages]);

  // listens for a signal that another user in the group is typing
  useEffect(() => {
    socket.on("isGroupTyping", ({ id, username, isTyping }) => {
      if (selectedGroup === id) {
        setUsersTyping((prev) => ({ ...prev, [username]: isTyping ? 1 : 0 }));
      }
    });

    return () => {
      socket.off("isGroupTyping");
    };
  }, [usersTyping, selectedGroup]);

  // when a user clicks a new group tab at the top of the page, sets the id associated with that tab
  // in state and in the search params, retrieves that users and messages from that group, checks if
  // any of the users are online, and sets the user list and message list in state
  const changeSelectedTab = useCallback(
    async (
      id: string,
      groupName: string,
      host: string,
      unreadGroupMessages: number
    ) => {
      try {
        setLoadingMessages(true);
        setSelectedGroup({ id, title: groupName, host });
        setSearchParams({ id });
        setUsersTyping({});
        if (username) {
          const { users, messages } =
            await groupConversationsAPI.getGroupMessages(
              username,
              id,
              unreadGroupMessages
            );
          socket.emit("isOnlineGroup", users, (newUsers: groupUserTab[]) => {
            setCurrentUsers(newUsers);
          });
          setCurrentMessages(messages);
          if (unreadGroupMessages > 0) {
            setGroupTabs((prev) =>
              prev.map((g) => (g.id === id ? { ...g, unreadMessages: 0 } : g))
            );
            socket.emit("clearTotalUnreadGroupMessages", {
              unreadGroupMessages,
            });
            dispatch(setUnreadGroupMessages(unreadGroupMessages * -1));
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingMessages(false);
      }
    },
    [selectedGroup, currentUsers, dispatch]
  );

  // listens for changes in the message input on the front end and changes message input state
  const handleMessage = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setMessageInput((prev) => ({ ...prev, [name]: value }));
    },
    [messageInput]
  );

  // when user types at least one character into message input, sends socket signal to other group
  // members in conversation to let them know you are preparing a message for them
  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      if (selectedGroup) {
        socket.emit("isGroupTyping", {
          id: selectedGroup,
          isTyping: true,
        });
      }
    },
    [messageInput, selectedGroup]
  );

  // when user clicks off of message input, sends socket signal to other group members
  // to let them know you are not typing anymore
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      if (selectedGroup) {
        socket.emit("isGroupTyping", {
          id: selectedGroup,
          isTyping: false,
        });
      }
    },
    [messageInput, selectedGroup]
  );

  // listens for send button click event and adds new message to db and to front end message list
  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const id = searchParams.get("id");
      if (username && id) {
        const { message, users } =
          await groupConversationsAPI.createGroupMessage(
            username,
            id,
            messageInput
          );
        setMessageInput(initialMessageInput.current);
        setCurrentMessages((prev) => [...prev, message]);
        socket.emit("groupMessage", {
          message,
          id,
          group: selectedGroup.title,
          userList: users,
        });
      }
    },
    [messageInput, selectedGroup, currentMessages]
  );

  return {
    scrollRef,
    groupTabs,
    messageInput,
    selectedGroup,
    currentUsers,
    currentMessages,
    usersTyping,
    loadingMessages,
    handleMessage,
    handleSend,
    handleFocus,
    handleBlur,
    changeSelectedTab,
  };
};

export default useGroupConversationPage;
