import { useState, useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading, setUnreadMessages } from "../../features/slices/auth";
import type {
  conversation,
  conversationMessage,
  savedMessage,
} from "../../types/conversationTypes";
import directConversationsAPI from "../../apis/directConversationsAPI";
import socket from "../../helpers/socket";

const useConversationListPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  });

  const initialInput: savedMessage = { content: "" };
  const [conversations, setConversations] = useState<conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<number>(0);
  const [currentMessages, setCurrentMessages] = useState<conversationMessage[]>(
    []
  );
  const [messageInput, setMessageInput] = useState<savedMessage>(initialInput);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  //for auto scrolling to the bottom of the messages list
  const scrollRef = useRef<HTMLDivElement>(null);

  // gets all of a user's direct conversations
  useEffect(() => {
    try {
      dispatch(setFormLoading(true));
      const getConversations = async () => {
        if (username) {
          const conversations = await directConversationsAPI.getConversations(
            username
          );
          setConversations(conversations);
        }
      };
      getConversations();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setFormLoading(false));
    }
  }, [dispatch]);

  // auto scrolls to the bottom of the messages list div whenever a new message is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages]);

  // updates list of current messages when a message from current conversation is added from other user in conversation
  useEffect(() => {
    socket.on("directMessage", ({ message, id }) => {
      if (id === currentConversation) {
        console.log("THIS SHOULD DECREASE MESSAGES NOTIFICATIONS");
        setCurrentMessages((prev) => {
          return [...prev, message];
        });
        dispatch(setUnreadMessages(-1));
        socket.emit("decreaseUnreadMessages", { id });
      } else {
        console.log("THIS SHOULD INCREASE MESSAGES NOTIFICATIONS");
        const newConversations = conversations.map((convo) => {
          return convo.id === id
            ? { ...convo, unreadMessages: convo.unreadMessages + 1 }
            : convo;
        });
        setConversations(newConversations);
      }
    });

    return () => {
      socket.off("directMessage");
    };
  }, [currentConversation, conversations]);

  const handleCurrentConversation = useCallback(
    async (conversation: conversation) => {
      setLoadingMessages(true);
      setCurrentConversation(conversation.id);
      setMessageInput((prev) => ({ ...prev, content: "" }));
      if (conversation.unreadMessages > 0) {
        const newConversations = conversations.map((convo) =>
          convo.id === conversation.id ? { ...convo, unreadMessages: 0 } : convo
        );
        setConversations(newConversations);
        dispatch(setUnreadMessages(conversation.unreadMessages * -1));
        socket.emit("clearTotalUnreadMessages", {
          unreadMessages: conversation.unreadMessages,
        });
      }
      let messages = await directConversationsAPI.getMessages(
        username!,
        conversation.id,
        conversation.unreadMessages
      );
      setCurrentMessages(messages);

      setLoadingMessages(false);
    },
    [loadingMessages, currentConversation, conversations]
  );

  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      let { name, value } = e.target;
      setMessageInput((prev) => ({ ...prev, [name]: value }));
    },
    [messageInput]
  );

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      try {
        e.preventDefault();
        if (!messageInput.content) {
          throw new Error("message cannot be empty");
        }
        const { message, otherUser } =
          await directConversationsAPI.createMessage(
            messageInput,
            username!,
            currentConversation
          );
        setCurrentMessages((prev) => {
          return [...prev, message];
        });
        setMessageInput(initialInput);
        socket.emit("directMessage", {
          message,
          id: currentConversation,
          to: otherUser.username,
        });
      } catch (err) {
        console.log(err);
      }
    },
    [messageInput]
  );

  return {
    loadingMessages,
    conversations,
    currentConversation,
    messageInput,
    currentMessages,
    scrollRef,
    handleCurrentConversation,
    handleChangeInput,
    handleSend,
  };
};

export default useConversationListPage;
