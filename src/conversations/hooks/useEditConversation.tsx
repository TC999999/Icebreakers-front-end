import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import type {
  currentConversation,
  updateConversation,
  returnUpdateConversation,
} from "../../types/conversationTypes";
import directConversationsAPI from "../../apis/directConversationsAPI";
import { shallowEqual } from "react-redux";
import socket from "../../helpers/socket";
import { toast } from "react-toastify";

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
  const notify = (message: string) => toast.error(message);

  const initialData: updateConversation = { title: "" };

  const [formData, setFormData] = useState<updateConversation>(initialData);

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
      try {
        e.preventDefault();
        dispatch(setFormLoading(true));
        hideForm(e);
        const conversation = await directConversationsAPI.updateConversation(
          formData,
          username!,
          currentConversation.id,
        );
        updateConversations(conversation);
        socket.emit("editConversation", {
          conversation,
          to: currentConversation.recipient,
        });
      } catch (err: any) {
        const error = JSON.parse(err.message);
        notify(error.message);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData],
  );

  // hides form if user clicks cancel button
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();
      hideForm(e);
    },
    [],
  );

  return { formData, handleChange, handleSubmit, handleCancel };
};

export default useEditConversation;
