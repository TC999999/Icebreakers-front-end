import { useState, useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { useSearchParams } from "react-router-dom";
import {
  setFormLoading,
  setUnreadDirectMessages,
} from "../../features/slices/auth";
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
import messageTruncate from "../../helpers/messageTruncate";
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
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [showTabletConversationTabs, setShowTabletConversationTabs] =
    useState<boolean>(false);

  //for auto scrolling to the bottom of the messages list
  const scrollRef = useRef<HTMLDivElement>(null);

  // reusable function used to update unread direct message notification indicator
  const updateDirectMessageCount = useCallback(
    (unreadMessages: number, id: string) => {
      if (unreadMessages > 0) {
        setConversations((prev) =>
          prev.map((convo) =>
            convo.id === id ? { ...convo, unreadMessages: 0 } : convo
          )
        );

        dispatch(setUnreadDirectMessages(unreadMessages * -1));
        socket.emit("clearTotalUnreadDirectMessages", {
          unreadMessages,
        });
      }
    },
    []
  );

  // gets all of a user's direct conversations on initial render. If there's a conversation id in parameters,
  // retrieves messages from that conversation
  useEffect(() => {
    let ignore = true;
    const getConversations = async () => {
      try {
        dispatch(setFormLoading(true));
        if (username) {
          const conversations = await directConversationsAPI.getConversations(
            username
          );
          setConversations(conversations);
          const id = searchParams.get("id");
          if (id) {
            setLoadingMessages(true);

            const { messages, conversationData, unreadMessages } =
              await directConversationsAPI.getMessages(username, id);
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

            if (!ignore) updateDirectMessageCount(unreadMessages, id);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    };
    getConversations();

    return () => {
      ignore = false;
    };
  }, []);

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

  // updates list of current messages when a message from current conversation
  // is added from other user in conversation
  useEffect(() => {
    socket.on("directMessage", ({ message, id }) => {
      if (id === currentConversation.id) {
        setCurrentMessages((prev) => {
          return [...prev, message];
        });

        let findConvo = conversations.find(
          (conversation) => conversation.id === currentConversation.id
        );
        if (findConvo) {
          findConvo = {
            ...findConvo,
            latestMessage: messageTruncate(message.content),
            lastUpdatedAt: message.createdAt,
          };

          const filteredConversations = conversations.filter((convo) => {
            return convo.id !== currentConversation.id;
          });

          setConversations([findConvo, ...filteredConversations]);
        }
        dispatch(setUnreadDirectMessages(-1));
        socket.emit("decreaseUnreadDirectMessages", { id });
      } else {
        let findConvo = conversations.find(
          (conversation) => conversation.id === id
        );
        if (findConvo) {
          findConvo = {
            ...findConvo,
            latestMessage: messageTruncate(message.content),
            lastUpdatedAt: message.createdAt,
            unreadMessages: findConvo.unreadMessages + 1,
          };
          const filteredConversations = conversations.filter((convo) => {
            return convo.id !== id;
          });
          setConversations([findConvo, ...filteredConversations]);
        }
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

      setConversations(
        conversations.map((c) => {
          return c.id === id ? { ...c, isTyping } : c;
        })
      );
    });

    return () => {
      socket.off("isTyping");
    };
  }, [currentConversation, conversations]);

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

  // if hidden conversation tab list is shown on smaller screen, automatically hides tab list if
  // screen width is wider than 1173px
  useEffect(() => {
    const handleResize = () => {
      if (showTabletConversationTabs && window.innerWidth > 1173) {
        setShowTabletConversationTabs(false);
      }
    };
    window.addEventListener("resize", handleResize);
  }, [showTabletConversationTabs]);

  // handles when a user changes conversation tabs: if conversation has unread messages,
  // clears unread message number and subtracts
  // that amount from total number of unread messages, also changes online status of other user
  const handleCurrentConversation = useCallback(
    async (conversation: conversation) => {
      if (conversation.id !== currentConversation.id) {
        setLoadingMessages(true);
        savedMessages.delete(currentConversation.id);

        if (currentConversation.id && messageInput.content.length > 0) {
          savedMessages.set(currentConversation.id, messageInput.content);
        }

        updateDirectMessageCount(conversation.unreadMessages, conversation.id);

        const { messages } = await directConversationsAPI.getMessages(
          username!,
          conversation.id
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
        if (showTabletConversationTabs) setShowTabletConversationTabs(false);
      }
    },
    [
      loadingMessages,
      currentConversation,
      conversations,
      typingMessage,
      messageInput,
      savedMessages,
      showTabletConversationTabs,
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

  // toggles showing form to delete current conversation title (document.activeElement.blur() is
  // to prevent user from accidentally closing the form by any enter key misclicks on keyboard
  // before changing input value)
  const toggleDeleteForm = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      setShowDeleteForm(!showDeleteForm);
    },
    [showDeleteForm]
  );

  // toggles showing left hand conversation tab list on smaller screen sizes (document.activeElement.blur() is
  // to prevent user from accidentally closing the form by any enter key misclicks on keyboard
  // before changing input value)
  const toggleTabletConversationTabs = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      setShowTabletConversationTabs(!showTabletConversationTabs);
    },
    [showTabletConversationTabs]
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
          currentConversation.id,
          currentConversation.recipient
        );
        setCurrentMessages((prev) => {
          return [...prev, message];
        });

        setMessageInput(initialInput);

        let findConvo = conversations.find(
          (conversation) => conversation.id === currentConversation.id
        );
        if (findConvo) {
          findConvo = {
            ...findConvo,
            latestMessage: messageTruncate(message.content),
            lastUpdatedAt: message.createdAt,
          };

          const filteredConversations = conversations.filter((convo) => {
            return convo.id !== currentConversation.id;
          });

          setConversations([findConvo, ...filteredConversations]);
        }

        socket.emit("isTyping", {
          otherUser: username,
          id: currentConversation.id,
          to: currentConversation.recipient,
          isTyping: false,
        });

        socket.emit("directMessage", {
          message,
          id: currentConversation.id,
          to: currentConversation.recipient,
        });
      } catch (err: any) {
        notify(err.message);
      }
    },
    [messageInput, conversations]
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
    showDeleteForm,
    showTabletConversationTabs,
    handleCurrentConversation,
    toggleEditForm,
    toggleDeleteForm,
    toggleTabletConversationTabs,
    handleChangeInput,
    handleFocus,
    handleBlur,
    handleSend,
    updateConversations,
  };
};

export default useConversationListPage;
