import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { type directConversationRequest } from "../../types/requestTypes";
import { useAppDispatch } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setFormLoading, setLoadError } from "../../features/slices/auth";
import socket from "../../helpers/socket";
import directRequestsAPI from "../../apis/directRequestsAPI";
import useValidInputHandler from "../../appHooks/useValidInputHandler";

const useRequestForm = (
  requestedUserInput: string,
  requesterUserInput: string
) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const initialData: directConversationRequest = {
    to: requestedUserInput,
    from: requesterUserInput,
    content: "",
  };
  const [requestData, setRequestData] =
    useState<directConversationRequest>(initialData);

  const originalData = useRef<directConversationRequest>(initialData);

  const {
    validInputs,
    showDirections,
    currentErrorFlash,
    handleDirectionsBlur,
    handleDirectionsFocus,
    handleInputValidity,
    handleSubmitValidity,
    handleClientFlashError,
  } = useValidInputHandler(originalData.current);

  useEffect(() => {
    const setUsers = () => {
      setRequestData((prev) => ({
        ...prev,
        to: requestedUserInput,
        from: requesterUserInput,
      }));
    };

    setUsers();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setRequestData((prev) => ({ ...prev, [name]: value }));
    },
    [requestData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (handleSubmitValidity()) {
          dispatch(setFormLoading(true));
          const { request } =
            await directRequestsAPI.makeDirectConversationRequest(requestData);

          socket.emit("addRequest", {
            requestType: "direct-requests-received",
            countType: "receivedDirectRequestCount",
            to: requestData.to,
            request,
          });
          navigate(`/user/${requestData.to}`);
        } else {
          handleClientFlashError();
        }
      } catch (err: any) {
        dispatch(setLoadError(JSON.parse(err)));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [requestData]
  );

  return {
    validInputs,
    showDirections,
    requestData,
    currentErrorFlash,
    handleChange,
    handleSubmit,
    handleDirectionsFocus,
    handleDirectionsBlur,
  };
};

export default useRequestForm;
