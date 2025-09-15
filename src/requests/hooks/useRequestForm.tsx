import { useState, useCallback } from "react";
import { type directConversationRequest } from "../../types/requestTypes";

const useRequestForm = (requestedUser: string, requesterUser: string) => {
  const initialData: directConversationRequest = {
    requestedUser,
    requesterUser,
    content: "",
  };
  const [requestData, setRequestData] =
    useState<directConversationRequest>(initialData);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      const { name, value } = e.target;
      setRequestData((prev) => ({ ...prev, [name]: value }));
    },
    [requestData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();

      console.log(requestData);
    },
    []
  );

  return { requestData, handleChange, handleSubmit };
};

export default useRequestForm;
