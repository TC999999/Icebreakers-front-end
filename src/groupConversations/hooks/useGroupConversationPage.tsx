import { useState, useEffect, useCallback, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import {
  setFormLoading,
  setUnreadGroupMessages,
} from "../../features/slices/auth";
import { useSearchParams } from "react-router-dom";
import type { groupTab, selectedGroup } from "../../types/groupTypes";
import type { groupUserTab, userTyping } from "../../types/userTypes";
import type {
  conversationMessage,
  newConversationMessage,
} from "../../types/conversationTypes";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import socket from "../../helpers/socket";
import { shallowEqual } from "react-redux";

// custom react hook for group conversation page; handles all group conversation logic such as
// retrieving initial list of conversations, getting a list of all users and messages for
// those respective groups, and creating new messages
const useGroupConversationPage = () => {
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);
  const dispatch: AppDispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const initialMessageInput = useRef<newConversationMessage>({ content: "" });

  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
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

  // reusable function used to update unread group message notification indicator
  const updateGroupMessageCount = useCallback(
    (unreadMessages: number, id: string) => {
      if (unreadMessages > 0) {
        setGroupTabs((prev) =>
          prev.map((g) => (g.id === id ? { ...g, unreadMessages: 0 } : g))
        );
        socket.emit("clearTotalUnreadGroupMessages", {
          unreadMessages,
        });
        dispatch(setUnreadGroupMessages(unreadMessages * -1));
      }
    },
    []
  );

  // on initial render get a list of all the current user's groups and sets them in state,
  // if there is a group id set in state, gets all other users and messages and sets them
  // in state, ignore flag prevents any mathematical errors for unread message count
  useEffect(() => {
    let ignore = true;

    const getGroupTabs = async () => {
      try {
        dispatch(setFormLoading(true));
        if (username) {
          const groups = await groupConversationsAPI.getGroupTabs(username);
          setGroupTabs(groups);

          const id = searchParams.get("id");
          if (id) {
            setLoadingMessages(true);
            const { users, messages, title, host, unreadMessages } =
              await groupConversationsAPI.getGroupMessages(username, id);
            setSelectedGroup({ id, title, host });
            socket.emit("isOnlineGroup", users, (newUsers: groupUserTab[]) => {
              setCurrentUsers(newUsers);
            });

            setCurrentMessages(messages);
            setLoadingMessages(false);
            if (!ignore) updateGroupMessageCount(unreadMessages, id);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getGroupTabs();

    return () => {
      ignore = false;
    };
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
      if (selectedGroup.id === id) {
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
      if (selectedGroup.id === id) {
        setUsersTyping((prev) => ({ ...prev, [username]: isTyping ? 1 : 0 }));
      }
    });

    return () => {
      socket.off("isGroupTyping");
    };
  }, [usersTyping, selectedGroup]);

  // socket signal listener to add new user to group if current group id matches received
  // group id, stops listening when component unmounts
  useEffect(() => {
    socket.on("addUserToGroup", ({ groupID, user, isOnline }) => {
      if (selectedGroup.id === groupID) {
        setCurrentUsers((prev) => [
          ...prev,
          {
            username: user.username,
            favoriteColor: user.favoriteColor,
            isOnline,
          },
        ]);
      }
    });

    return () => {
      socket.off("addUserToGroup");
    };
  }, [currentUsers, selectedGroup]);

  // when a user clicks a new group tab at the top of the page, sets the id associated with that tab
  // in state and in the search params, retrieves that users and messages from that group, checks if
  // any of the users are online, and sets the user list and message list in state
  const changeSelectedTab = useCallback(
    async (id: string, unreadMessages: number): Promise<void> => {
      if (id !== selectedGroup.id) {
        setLoadingMessages(true);
        setSearchParams({ id });
        setUsersTyping({});
        if (username) {
          const { users, messages, title, host } =
            await groupConversationsAPI.getGroupMessages(username, id);
          setSelectedGroup({ id, title, host });
          socket.emit("isOnlineGroup", users, (newUsers: groupUserTab[]) => {
            setCurrentUsers(newUsers);
          });
          setCurrentMessages(messages);
          updateGroupMessageCount(unreadMessages, id);
        }

        setLoadingMessages(false);
      }
    },
    [
      loadingMessages,
      selectedGroup,
      currentMessages,
      usersTyping,
      messageInput,
      currentUsers,
      dispatch,
    ]
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

      if (selectedGroup.id.length > 0) {
        socket.emit("isGroupTyping", {
          id: selectedGroup.id,
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
      if (selectedGroup.id.length > 0) {
        socket.emit("isGroupTyping", {
          id: selectedGroup.id,
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
