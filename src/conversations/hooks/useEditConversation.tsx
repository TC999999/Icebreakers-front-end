import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/loading";
import type {
  currentConversation,
  updateConversation,
  returnUpdateConversation,
} from "../../types/conversationTypes";
import directConversationsAPI from "../../apis/directConversationsAPI";
import { shallowEqual } from "react-redux";
import useRequestErrorHandler from "../../appHooks/useRequestErrorHandler";

type input = {
  currentConversation: currentConversation;
  hideForm: (e: React.FormEvent) => void;
  updateConversations: (newConversation: returnUpdateConversation) => void;
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

  const initialData: updateConversation = { title: "" };

  const [formData, setFormData] = useState<updateConversation>(initialData);

  const { handleSubmitRequestError } = useRequestErrorHandler();

  // on initial render, updates form data to initially have the current conversation title in state
  useEffect(() => {
    const initialSet = () => {
      setFormData((prev) => ({ ...prev, title: currentConversation.title }));
    };
    initialSet();
  }, [currentConversation]);

  // updates form data state on input value change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData],
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
          formData,
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
    [formData],
  );

  return { formData, handleChange, handleSubmit };
};

export default useEditConversation;
