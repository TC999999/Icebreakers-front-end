import { useState, useCallback, useEffect } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { type directConversationRequest } from "../../types/requestTypes";
import { useAppDispatch } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setFormLoading, setLoadError } from "../../features/slices/auth";
import requestsAPI from "../../apis/requestsAPI";

const useRequestForm = (
  requestedUserInput: string,
  requesterUserInput: string
) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const initialData: directConversationRequest = {
    requestedUser: requestedUserInput,
    requesterUser: requesterUserInput,
    content: "",
  };
  const [requestData, setRequestData] =
    useState<directConversationRequest>(initialData);

  useEffect(() => {
    const setUsers = () => {
      setRequestData((prev) => ({
        ...prev,
        requestedUser: requestedUserInput,
        requesterUser: requesterUserInput,
      }));
    };

    setUsers();
  }, []);

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
      try {
        dispatch(setFormLoading(true));
        await requestsAPI.makeDirectConversationRequest(requestData);
        navigate(`/user/${requestData.requestedUser}`);
      } catch (err: any) {
        dispatch(setLoadError(JSON.parse(err)));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [requestData]
  );

  return { requestData, handleChange, handleSubmit };
};

export default useRequestForm;
