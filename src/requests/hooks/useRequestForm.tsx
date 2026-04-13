import { useState, useCallback, useRef } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import type { DirectConversationRequest } from "../../types/requestTypes";
import { useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/loading";
import directRequestsAPI from "../../apis/directRequestsAPI";
import useValidInputHandler from "../../appHooks/useValidInputHandler";
import useRequestErrorHandler from "../../appHooks/useRequestErrorHandler";

// custom hook for form to create a new request to chat with another user
const useRequestForm = (to: string, from: string) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const originalData = useRef<DirectConversationRequest>({
    to,
    content: "",
  });

  const [requestData, setRequestData] = useState<DirectConversationRequest>(
    originalData.current,
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

  const { handleSubmitRequestError } = useRequestErrorHandler();

  // changes form data state and input value validity state when input value is changed by user
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setRequestData((prev) => ({ ...prev, [name]: value }));
    },
    [requestData],
  );

  // submits request data to backend to create and return a new direct conversation request; emits
  // socket signal to requested user to add request to their inbox
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (handleSubmitValidity()) {
          dispatch(setFormLoading(true));

          await directRequestsAPI.makeDirectConversationRequest(
            from,
            requestData,
          );

          navigate(`/user/${to}`);
        } else {
          handleClientFlashError();
        }
      } catch (err: any) {
        handleSubmitRequestError(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [requestData, validInputs],
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
