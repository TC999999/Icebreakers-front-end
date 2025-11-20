import { useState, useCallback, useRef } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { type directConversationRequest } from "../../types/requestTypes";
import { useAppDispatch } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import socket from "../../helpers/socket";
import directRequestsAPI from "../../apis/directRequestsAPI";
import useValidInputHandler from "../../appHooks/useValidInputHandler";
import { toast } from "react-toastify";

// custom hook for form to create a new request to chat with another user
const useRequestForm = (to: string, from: string) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (message: string) => toast.error(message);

  const originalData = useRef<directConversationRequest>({
    to,
    content: "",
  });

  const [requestData, setRequestData] = useState<directConversationRequest>(
    originalData.current
  );

  // reusable custom validator hook for setting and checking input value validity
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

  // changes form data state and input value validity state when input value is changed by user
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setRequestData((prev) => ({ ...prev, [name]: value }));
    },
    [requestData]
  );

  // submits request data to backend to create and return a new direct conversation request; emits
  // socket signal to requested user to add request to their inbox
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (handleSubmitValidity()) {
          dispatch(setFormLoading(true));
          const { request } =
            await directRequestsAPI.makeDirectConversationRequest(
              from,
              requestData
            );

          socket.emit("addRequest", {
            requestType: "direct-requests-received",
            countType: "receivedDirectRequestCount",
            to,
            request,
          });
          navigate(`/user/${to}`);
        } else {
          handleClientFlashError();
        }
      } catch (err: any) {
        notify(JSON.parse(err.message).message);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [requestData, validInputs]
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
