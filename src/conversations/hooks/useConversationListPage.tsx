import { useState, useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
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
  const [conversations, setConversations] = useState<conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<number>(0);
  const [currentMessages, setCurrentMessages] = useState<conversationMessage[]>(
    []
  );
  //   const savedMessages = new Map<number, savedMessage>();

  const initialInput: savedMessage = { content: "" };

  const [messageInput, setMessageInput] = useState<savedMessage>(initialInput);

  //for auto scrolling to the bottom of the messages list
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      dispatch(setFormLoading(true));
      const getConversations = async () => {
        if (username) {
          const conversations = await directConversationsAPI.getConversations(
            username
          );
          //   console.log(conversations);
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

  useEffect(() => {
    socket.on("directMessage", ({ message, id }) => {
      if (id === currentConversation) {
        console.log("Insert into current messages");
        setCurrentMessages((prev) => {
          return [...prev, message];
        });
      } else {
        console.log("this does not belong in current messages");
      }
    });

    return () => {
      socket.off("directMessage");
    };
  }, [currentConversation]);

  const handleCurrentConversation = useCallback(
    async (conversation: conversation) => {
      //   console.log(conversation);
      setCurrentConversation(conversation.id);
      setMessageInput((prev) => ({ ...prev, content: "" }));
      let messages = await directConversationsAPI.getMessages(
        username!,
        conversation.id
      );
      setCurrentMessages(messages);
    },
    [currentConversation]
  );

  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      let { name, value } = e.target;
      setMessageInput((prev) => ({ ...prev, [name]: value }));
      //   if (messageInput.content.length > 0) {
      //     savedMessages.set(currentConversation, {
      //       content: value,
      //     });
      //   } else {
      //     savedMessages.delete(currentConversation);
      //   }
    },
    [messageInput]
  );

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      try {
        e.preventDefault();
        // console.log(messageInput);

        if (!messageInput.content) {
          throw new Error("message cannot be empty");
        }
        let { message, otherUser } = await directConversationsAPI.createMessage(
          messageInput,
          username!,
          currentConversation
        );
        // console.log(message);
        // console.log(otherUser);
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
