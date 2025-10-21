import { useState, useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { useSearchParams } from "react-router-dom";
import { setFormLoading, setUnreadMessages } from "../../features/slices/auth";
import type {
  conversation,
  conversationMessage,
  savedMessage,
  currentConversation,
  returnUpdateConversation,
} from "../../types/conversationTypes";
import directConversationsAPI from "../../apis/directConversationsAPI";
import socket from "../../helpers/socket";
import savedMessages from "../../helpers/maps/savedMessages";
import { shallowEqual } from "react-redux";

const useConversationListPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialInput: savedMessage = { content: "" };
  const initialConversationData: currentConversation = {
    id: 0,
    title: "",
    recipient: "",
  };
  const [conversations, setConversations] = useState<conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<currentConversation>(initialConversationData);
  const [currentMessages, setCurrentMessages] = useState<conversationMessage[]>(
    []
  );
  const [messageInput, setMessageInput] = useState<savedMessage>(initialInput);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [typingMessage, setTypingMessage] = useState<string>("");
  const [showEditForm, setShowEditForm] = useState<boolean>(false);

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
          const currentID = searchParams.get("id");
          if (currentID) {
            setLoadingMessages(true);
            let { messages, conversationData } =
              await directConversationsAPI.getMessages(
                username!,
                parseFloat(currentID),
                0
              );
            setCurrentConversation(conversationData);
            setCurrentMessages(messages);
            setLoadingMessages(false);
          }
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
      if (id === currentConversation.id) {
        setCurrentMessages((prev) => {
          return [...prev, message];
        });
        const newConversations = conversations.map((convo) => {
          return convo.id === currentConversation.id
            ? { ...convo, lastUpdatedAt: message.createdAt }
            : convo;
        });
        setConversations(newConversations);
        dispatch(setUnreadMessages(-1));
        socket.emit("decreaseUnreadMessages", { id });
      } else {
        const newConversations = conversations.map((convo) => {
          return convo.id === id
            ? {
                ...convo,
                unreadMessages: convo.unreadMessages + 1,
                lastUpdatedAt: message.createdAt,
              }
            : convo;
        });
        setConversations(newConversations);
      }
    });

    return () => {
      socket.off("directMessage");
    };
  }, [currentConversation, conversations]);

  // lets user know when other user in the conversation is typing
  useEffect(() => {
    socket.on("isTyping", ({ otherUser, id }) => {
      if (id === currentConversation.id) {
        setTypingMessage(`${otherUser} is typing`);
      }
    });

    socket.on("isNotTyping", ({ id }) => {
      if (id === currentConversation.id) {
        setTypingMessage("");
      }
    });

    return () => {
      socket.off("isTyping");
      socket.off("isNotTyping");
    };
  }, [currentConversation]);

  // handles when a user edits the title of a conversation
  useEffect(() => {
    socket.on("editConversation", ({ conversation }) => {
      const newConversations = conversations.map((c) => {
        return c.id === conversation.id ? { ...c, ...conversation } : c;
      });

      setConversations(newConversations);
      setCurrentConversation((prev) => ({
        ...prev,
        title: conversation.title,
      }));
    });

    return () => {
      socket.off("editConversation");
    };
  }, [conversations, currentConversation]);

  // handles when a user changes conversation tabs
  const handleCurrentConversation = useCallback(
    async (conversation: conversation) => {
      setLoadingMessages(true);
      savedMessages.delete(currentConversation.id);

      if (currentConversation.id > 0 && messageInput.content.length > 0) {
        savedMessages.set(currentConversation.id, messageInput.content);
      }

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
      let { messages, conversationData } =
        await directConversationsAPI.getMessages(
          username!,
          conversation.id,
          conversation.unreadMessages
        );

      const convoMessage = savedMessages.get(conversation.id);

      setMessageInput((prev) => ({
        ...prev,
        content: convoMessage ? convoMessage : "",
      }));

      setCurrentConversation(conversationData);
      setCurrentMessages(messages);
      setTypingMessage("");
      setLoadingMessages(false);
      setSearchParams({ id: conversation.id.toString() });
    },
    [
      loadingMessages,
      currentConversation,
      conversations,
      typingMessage,
      messageInput,
      savedMessages,
    ]
  );

  const toggleEditForm = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      setShowEditForm(!showEditForm);
    },
    [showEditForm]
  );

  // handles change event on message input, also lets other user know
  // if user is typing something
  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      let { name, value } = e.target;
      setMessageInput((prev) => ({ ...prev, [name]: value }));

      if (currentConversation.id > 0 && value.length > 0) {
        socket.emit("isTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
        });
      } else if (currentConversation.id > 0 && value.length === 0) {
        socket.emit("isNotTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
        });
      }
    },
    [messageInput, currentConversation]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (currentConversation.id > 0 && messageInput.content.length > 0) {
        socket.emit("isTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
        });
      }
    },
    [messageInput]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (currentConversation.id > 0) {
        socket.emit("isNotTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
        });
      }
    },
    [messageInput]
  );

  const updateConversations = useCallback(
    (newConversation: returnUpdateConversation) => {
      const newConversations = conversations.map((c) => {
        return c.id === newConversation.id ? { ...c, ...newConversation } : c;
      });

      setConversations(newConversations);
      setCurrentConversation((prev) => ({
        ...prev,
        title: newConversation.title,
      }));
    },
    [currentConversation, conversations]
  );

  // handles sending message to other users, including updated db
  // and sending a socket signal to other user
  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      try {
        e.preventDefault();
        if (document.activeElement instanceof HTMLElement)
          document.activeElement.blur();

        if (!messageInput.content) {
          throw new Error("message cannot be empty");
        }
        const { message, otherUser } =
          await directConversationsAPI.createMessage(
            messageInput,
            username!,
            currentConversation.id
          );
        setCurrentMessages((prev) => {
          return [...prev, message];
        });

        setMessageInput(initialInput);

        const newConversations = conversations.map((convo) => {
          return convo.id === currentConversation.id
            ? { ...convo, lastUpdatedAt: message.createdAt }
            : convo;
        });
        setConversations(newConversations);
        socket.emit("directMessage", {
          message,
          id: currentConversation.id,
          to: otherUser.username,
        });
        socket.emit("isNotTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
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
    typingMessage,
    scrollRef,
    showEditForm,
    handleCurrentConversation,
    toggleEditForm,
    handleChangeInput,
    handleFocus,
    handleBlur,
    handleSend,
    updateConversations,
  };
};

export default useConversationListPage;
