import { useState, useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { useSearchParams } from "react-router-dom";
import { setUnreadDirectMessages } from "../../features/slices/auth";
import type {
  conversation,
  returnUpdateConversation,
  newMessage,
  currentConversationMessages,
  conversationMessage,
} from "../../types/conversationTypes";
import directConversationsAPI from "../../apis/directConversationsAPI";
import socket from "../../helpers/socket";
import savedMessages from "../../helpers/maps/savedMessages";
import messageTruncate from "../../helpers/messageTruncate";
import { shallowEqual } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
import queryClient from "../../helpers/queryClient";

// hook for direct conversation page
const useConversationListPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id") || "";
  const initialConversationData: currentConversationMessages = {
    id: "",
    title: "",
    recipient: "",
    isOnline: false,
    unreadMessages: 0,
    messages: [],
  };

  const [messageInput, setMessageInput] = useState<string>("");
  const [typingMessage, setTypingMessage] = useState<string>("");
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showTabletConversationTabs, setShowTabletConversationTabs] =
    useState<boolean>(false);

  //for auto scrolling to the bottom of the messages list
  const scrollRef = useRef<HTMLDivElement>(null);

  // reusable function used to update unread direct message notification indicator
  const updateDirectMessageCount = useCallback(
    async (unreadMessages: number, id: string) => {
      try {
        if (unreadMessages > 0) {
          queryClient.setQueryData(["conversations"], () => {
            return conversations.map((conversation) => {
              return conversation.id === id
                ? { ...conversation, unreadMessages: 0 }
                : conversation;
            });
          });

          dispatch(setUnreadDirectMessages(unreadMessages * -1));
          socket.emit("clearTotalUnreadDirectMessages", {
            unreadMessages,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    [],
  );

  const { data: conversations, isLoading: loadingConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => directConversationsAPI.getConversations(username!),
    initialData: [],
    retry: 0,
  });

  const {
    data: {
      id: conversationID,
      title,
      recipient,
      isOnline,
      messages,
      unreadMessages,
    },
    isFetching: loadingMessages,
  } = useQuery({
    queryKey: ["currentConversation", { id }],
    queryFn: () => directConversationsAPI.getMessages(username!, id),
    initialData: initialConversationData,
    enabled: id.length > 0,
    retry: 0,
  });

  // gets all of a user's direct conversations on initial render. If there's a conversation id in parameters,
  // retrieves messages from that conversation
  useEffect(() => {
    const updateCurrentConversation = async () => {
      if (id) {
        socket.emit("isOnline", recipient, (response: boolean) => {
          queryClient.setQueryData(
            ["currentConversation", { id }],
            (prevData: currentConversationMessages) => {
              return {
                ...prevData,
                isOnline: response,
              };
            },
          );
        });

        updateDirectMessageCount(unreadMessages, id);
      }
    };

    updateCurrentConversation();
  }, [conversationID]);

  // lets user know when other user in the conversation is online
  useEffect(() => {
    socket.on("isOnline", ({ user, isOnline }) => {
      if (user === recipient) {
        queryClient.setQueryData(
          ["currentConversation", { id }],
          (prevData: currentConversationMessages) => {
            return {
              ...prevData,
              isOnline: isOnline,
            };
          },
        );
      }
    });

    return () => {
      socket.off("isOnline");
    };
  }, [id]);

  // auto scrolls to the bottom of the messages list div whenever a new message is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // updates list of current messages when a message from current conversation
  // is added from other user in conversation
  useEffect(() => {
    socket.on("directMessage", ({ message, id }) => {
      if (conversationID === id) {
        queryClient.setQueryData(
          ["currentConversation", { id }],
          (prevData: currentConversationMessages) => {
            return { ...prevData, messages: [...prevData.messages, message] };
          },
        );

        let findConvo = conversations.find(
          (conversation) => conversation.id === conversationID,
        );
        if (findConvo) {
          findConvo = {
            ...findConvo,
            latestMessage: messageTruncate(message.content),
            lastUpdatedAt: message.createdAt,
          };

          // fix this so that the conversation bubbles to the top instead of filter then add back
          const filteredConversations = conversations.filter((convo) => {
            return convo.id !== id;
          });

          queryClient.setQueryData(["conversations"], () => {
            return [findConvo, ...filteredConversations];
          });
        }
        dispatch(setUnreadDirectMessages(-1));
        socket.emit("decreaseUnreadDirectMessages", { id });
      } else {
        let findConvo = conversations.find(
          (conversation) => conversation.id === id,
        );
        if (findConvo) {
          findConvo = {
            ...findConvo,
            latestMessage: messageTruncate(message.content),
            lastUpdatedAt: message.createdAt,
            unreadMessages: findConvo.unreadMessages + 1,
          };

          // fix this so that the conversation bubbles to the top instead of filter then add back
          const filteredConversations = conversations.filter((convo) => {
            return convo.id !== id;
          });

          // fix this so that the conversation bubbles to the top instead of filter then add back
          queryClient.setQueryData(["conversations"], () => {
            return [findConvo, ...filteredConversations];
          });
        }
      }
    });

    return () => {
      socket.off("directMessage");
    };
  }, [conversationID, conversations]);

  // lets user know when other user in the conversation is typing
  useEffect(() => {
    socket.on("isTyping", ({ otherUser, id, isTyping }) => {
      if (id === conversationID)
        setTypingMessage(isTyping ? `${otherUser} is typing` : "");

      queryClient.setQueryData(
        ["conversations"],
        (prevData: conversation[]) => {
          return prevData.map((c) => {
            return c.id === id ? { ...c, isTyping } : c;
          });
        },
      );
    });

    return () => {
      socket.off("isTyping");
    };
  }, [conversationID, conversations]);

  // adds conversation to list if requested user accepts conversation request
  useEffect(() => {
    socket.on("addConversation", ({ conversation }) => {
      queryClient.setQueryData(
        ["conversations"],
        (prevData: conversation[]) => {
          return [conversation, ...prevData];
        },
      );
    });
    return () => {
      socket.off("addConversation");
    };
  }, []);

  // handles when a user edits the title of a conversation: when one user updates title,
  // sends socket signal to other user that also updates title
  useEffect(() => {
    socket.on("editConversation", ({ conversation }) => {
      queryClient.setQueryData(
        ["conversations"],
        (prevData: conversation[]) => {
          prevData.map((c) => {
            return c.id === conversation.id ? { ...c, ...conversation } : c;
          });
        },
      );

      if (conversationID === conversation.id) {
        queryClient.setQueryData(
          ["currentConversation", { id }],
          (prevData: currentConversationMessages) => {
            return {
              ...prevData,

              title: conversation.title,
            };
          },
        );
      }
    });

    return () => {
      socket.off("editConversation");
    };
  }, [conversations, title]);

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
      if (conversation.id !== conversationID) {
        savedMessages.delete(conversationID);

        if (conversationID && messageInput.length > 0) {
          savedMessages.set(conversationID, messageInput);
        }

        updateDirectMessageCount(conversation.unreadMessages, conversation.id);

        const convoMessage = savedMessages.get(conversation.id);

        setMessageInput(convoMessage ? convoMessage : "");

        setTypingMessage("");
        setSearchParams({ id: conversation.id.toString() });
        if (showTabletConversationTabs) setShowTabletConversationTabs(false);
      }
    },
    [
      loadingMessages,
      conversations,
      typingMessage,
      messageInput,
      savedMessages,
      showTabletConversationTabs,
    ],
  );

  // toggles showing form to edit current conversation title (document.activeElement.blur() is
  // to prevent user from accidentally closing the form by any enter key misclicks on keyboard
  // before changing input value)
  const toggleEditForm = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    ): void => {
      e.preventDefault();
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      setShowEditForm(!showEditForm);
    },
    [showEditForm],
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
    [showTabletConversationTabs],
  );

  // handles change event on message input, also lets other user know
  // if user is typing something
  const handleChangeInput = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>): void => {
      let { value } = e.target;
      setMessageInput(value);
      if (conversationID.length > 0 && value.length > 0) {
        socket.emit("isTyping", {
          otherUser: username,
          id: conversationID,
          to: recipient,
          isTyping: true,
        });
      } else if (conversationID.length > 0 && value.length === 0) {
        socket.emit("isTyping", {
          otherUser: username,
          id: conversationID,
          to: recipient,
          isTyping: false,
        });
      }
    },
    [messageInput, conversationID, recipient],
  );

  // when user types at least one character into message input, sends socket signal to other user
  // in conversation to let them know you are preparing a message for them
  const handleFocus = useCallback(
    (
      e:
        | React.FocusEvent<HTMLInputElement>
        | React.FocusEvent<HTMLTextAreaElement>,
    ) => {
      e.preventDefault();
      if (conversationID.length > 0 && messageInput.length > 0) {
        socket.emit("isTyping", {
          otherUser: username,
          id: conversationID,
          to: recipient,
          isTyping: true,
        });
      }
    },
    [messageInput, conversationID, recipient],
  );

  // when user clicks off of message input, sends socket signal to other user
  // in conversation to let them know you are not typing anymore
  const handleBlur = useCallback(
    (
      e:
        | React.FocusEvent<HTMLInputElement>
        | React.FocusEvent<HTMLTextAreaElement>,
    ) => {
      e.preventDefault();
      if (conversationID.length > 0) {
        socket.emit("isTyping", {
          otherUser: username,
          id: conversationID,
          to: recipient,
          isTyping: false,
        });
      }
    },
    [messageInput, conversationID, recipient],
  );

  // when user updates conversation title, updates conversation tab list to show new title and
  // updates title in header as well
  const updateConversations = useCallback(
    (newConversation: returnUpdateConversation) => {
      queryClient.setQueryData(
        ["conversations"],
        (prevData: conversation[]) => {
          return prevData.map((c) => {
            return c.id === newConversation.id
              ? { ...c, ...newConversation }
              : c;
          });
        },
      );

      queryClient.setQueryData(
        ["currentConversation", { id }],
        (prevData: currentConversationMessages) => {
          return {
            ...prevData,
            title: newConversation.title,
          };
        },
      );
    },
    [title, conversations],
  );

  // handles sending message to other users, including updated db
  // and sending a socket signal to other user
  const { mutate } = useMutation({
    mutationFn: (newMessage: newMessage) =>
      directConversationsAPI.createMessage(newMessage),

    onMutate: async (newMessage: newMessage) => {
      const { id: cID, username, content } = newMessage;

      const newDate = new Date().toISOString();

      const addMessage: conversationMessage = {
        id: cID,
        username,
        content,
        createdAt: newDate,
      };

      await queryClient.cancelQueries({
        queryKey: ["currentConversation", { id }],
      });

      const previousCurrentConversation =
        queryClient.getQueryData<currentConversationMessages>([
          "currentConversation",
          { id },
        ]);

      queryClient.setQueryData(
        ["currentConversation", { id }],
        (prevData: currentConversationMessages) => {
          return { ...prevData, messages: [...prevData.messages, addMessage] };
        },
      );

      return { previousCurrentConversation };
    },

    onSuccess: () => {
      setMessageInput("");
    },

    onError: (err: Error, response: newMessage, context) => {
      queryClient.setQueryData(
        ["currentConversation", { id }],
        context?.previousCurrentConversation,
      );
    },
  });

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      mutate({
        id: conversationID,
        username: username!,
        content: messageInput,
        otherUser: recipient,
      });
    },
    [conversationID, username, messageInput, recipient],
  );

  return {
    loadingMessages,
    loadingConversations,
    conversations,
    conversationID,
    title,
    isOnline,
    recipient,
    messageInput,
    messages,
    typingMessage,
    scrollRef,
    showEditForm,
    showTabletConversationTabs,
    handleCurrentConversation,
    toggleEditForm,
    toggleTabletConversationTabs,
    handleChangeInput,
    handleFocus,
    handleBlur,
    handleSend,
    updateConversations,
  };
};

export default useConversationListPage;
