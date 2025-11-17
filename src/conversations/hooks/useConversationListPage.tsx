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
import { toast } from "react-toastify";

// hook for direct conversation page
const useConversationListPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const notify = (message: string) => toast.error(message);
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialInput: savedMessage = { content: "" };
  const initialConversationData: currentConversation = {
    id: "",
    title: "",
    recipient: "",
    isOnline: false,
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

  // gets all of a user's direct conversations on initial render. If there's a conversation id in parameters,
  // retrieves messages from that conversation
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
              await directConversationsAPI.getMessages(username!, currentID, 0);
            setCurrentConversation(conversationData);
            socket.emit(
              "isOnline",
              conversationData.recipient,
              (response: boolean) => {
                setCurrentConversation((prev) => ({
                  ...prev,
                  isOnline: response,
                }));
              }
            );
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

  // lets user know when other user in the conversation is online
  useEffect(() => {
    socket.on("isOnline", ({ user, isOnline }) => {
      if (user === currentConversation.recipient) {
        setCurrentConversation((prev) => ({ ...prev, isOnline: isOnline }));
      }
    });

    return () => {
      socket.off("isOnline");
    };
  }, [currentConversation]);

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
    socket.on("isTyping", ({ otherUser, id, isTyping }) => {
      if (id === currentConversation.id) {
        if (isTyping) {
          setTypingMessage(`${otherUser} is typing`);
        } else {
          setTypingMessage("");
        }
      }
    });

    return () => {
      socket.off("isTyping");
    };
  }, [currentConversation]);

  // adds conversation to list if requested user accepts conversation request
  useEffect(() => {
    socket.on("addConversation", ({ conversation }) => {
      setConversations((prev) => [conversation, ...prev]);
    });

    return () => {
      socket.off("addConversation");
    };
  }, []);

  // handles when a user edits the title of a conversation: when one user updates title,
  // sends socket signal to other user that also updates title
  useEffect(() => {
    socket.on("editConversation", ({ conversation }) => {
      const newConversations = conversations.map((c) => {
        return c.id === conversation.id ? { ...c, ...conversation } : c;
      });

      setConversations(newConversations);
      if (currentConversation.id === conversation.id) {
        setCurrentConversation((prev) => ({
          ...prev,
          title: conversation.title,
        }));
      }
    });

    return () => {
      socket.off("editConversation");
    };
  }, [conversations, currentConversation]);

  // handles when a user changes conversation tabs: if conversation has unread messages,
  // clears unread message number and subtracts
  // that amount from total number of unread messages, also changes online status of other user
  const handleCurrentConversation = useCallback(
    async (conversation: conversation) => {
      setLoadingMessages(true);
      savedMessages.delete(currentConversation.id);

      if (currentConversation.id && messageInput.content.length > 0) {
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
      let { messages } = await directConversationsAPI.getMessages(
        username!,
        conversation.id,
        conversation.unreadMessages
      );

      const convoMessage = savedMessages.get(conversation.id);

      setMessageInput((prev) => ({
        ...prev,
        content: convoMessage ? convoMessage : "",
      }));

      socket.emit("isOnline", conversation.otherUser, (response: boolean) => {
        setCurrentConversation((prev) => ({
          ...prev,
          id: conversation.id,
          title: conversation.title,
          recipient: conversation.otherUser,
          isOnline: response,
        }));
      });
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

  // toggles showing form to edit current conversation title (document.activeElement.blur() is
  // to prevent user from accidentally closing the form by any enter key misclicks on keyboard
  // before changing input value)
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
    (e: React.FocusEvent<HTMLTextAreaElement>): void => {
      let { name, value } = e.target;
      setMessageInput((prev) => ({ ...prev, [name]: value }));
      if (currentConversation.id.length > 0 && value.length > 0) {
        socket.emit("isTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
          isTyping: true,
        });
      } else if (currentConversation.id.length > 0 && value.length === 0) {
        socket.emit("isTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
          isTyping: false,
        });
      }
    },
    [messageInput, currentConversation]
  );

  // when user types at least one character into message input, sends socket signal to other user
  // in conversation to let them know you are preparing a message for them
  const handleFocus = useCallback(
    (
      e:
        | React.FocusEvent<HTMLInputElement>
        | React.FocusEvent<HTMLTextAreaElement>
    ) => {
      e.preventDefault();
      if (
        currentConversation.id.length > 0 &&
        messageInput.content.length > 0
      ) {
        socket.emit("isTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
          isTyping: true,
        });
      }
    },
    [messageInput]
  );

  // when user clicks off of message input, sends socket signal to other user
  // in conversation to let them know you are not typing anymore
  const handleBlur = useCallback(
    (
      e:
        | React.FocusEvent<HTMLInputElement>
        | React.FocusEvent<HTMLTextAreaElement>
    ) => {
      e.preventDefault();
      if (currentConversation.id.length > 0) {
        socket.emit("isTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
          isTyping: false,
        });
      }
    },
    [messageInput]
  );

  // when user updates conversation title, updates conversation tab list to show new title and
  // updates title in header as well
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
        const { message } = await directConversationsAPI.createMessage(
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
          to: currentConversation.recipient,
        });
        socket.emit("isTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
          isTyping: false,
        });
      } catch (err: any) {
        notify(err.message);
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
