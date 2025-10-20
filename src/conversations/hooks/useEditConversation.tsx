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

type input = {
  currentConversation: currentConversation;
  hideForm: (e: React.FormEvent) => void;
  show: boolean;
  updateConversations: (newConversation: returnUpdateConversation) => void;
};

const useEditConversation = ({
  currentConversation,
  hideForm,
  show,
  updateConversations,
}: input) => {
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);
  const dispatch: AppDispatch = useAppDispatch();

  const initialData: updateConversation = { title: "" };

  const [formData, setFormData] = useState<updateConversation>(initialData);

  useEffect(() => {
    const initialSet = () => {
      setFormData((prev) => ({ ...prev, title: currentConversation.title }));
    };
    initialSet();
  }, [currentConversation, show]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      try {
        e.preventDefault();
        dispatch(setFormLoading(true));
        hideForm(e);
        const returnData = await directConversationsAPI.updateConversation(
          formData,
          username!,
          currentConversation.id
        );
        updateConversations(returnData);
      } catch (err) {
        console.log(err);
        hideForm(e);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData, show]
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();
      hideForm(e);
    },
    [show]
  );

  return { formData, handleChange, handleSubmit, handleCancel };
};

export default useEditConversation;
