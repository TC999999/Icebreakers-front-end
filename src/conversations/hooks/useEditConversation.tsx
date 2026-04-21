import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/loading";
import type {
  CurrentConversation,
  ReturnUpdateConversation,
} from "../../types/conversationTypes";
import directConversationsAPI from "../../apis/directConversationsAPI";
import { shallowEqual } from "react-redux";
import useRequestErrorHandler from "../../appHooks/useRequestErrorHandler";

type input = {
  currentConversation: CurrentConversation;
  hideForm: (e: React.FormEvent) => void;
  updateConversations: (newConversation: ReturnUpdateConversation) => void;
};

// hook for form page to edit conversation title
const useEditConversation = ({
  currentConversation,
  hideForm,
  updateConversations,
}: input) => {
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);
  const dispatch: AppDispatch = useAppDispatch();

  const [title, setTitle] = useState<string>("");

  const { handleSubmitRequestError } = useRequestErrorHandler();

  // on initial render, updates form data to initially have the current conversation title in state
  useEffect(() => {
    const initialSet = () => {
      setTitle(currentConversation.title);
    };
    initialSet();
  }, [currentConversation]);

  // updates form data state on input value change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = e.target;
      setTitle(value);
    },
    [title],
  );

  // updates current conversation data in the database and returns data to update current
  // conversation title in the header and tab list
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        dispatch(setFormLoading(true));
        hideForm(e);
        const conversation = await directConversationsAPI.updateConversation(
          title,
          username!,
          currentConversation.id,
        );
        updateConversations(conversation);
      } catch (err: any) {
        handleSubmitRequestError(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [title],
  );

  return { title, handleChange, handleSubmit };
};

export default useEditConversation;
