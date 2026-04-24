import { useState, useCallback, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { GroupRequestFormData } from "../../types/requestTypes";
import groupRequestsAPI from "../../apis/groupRequestsAPI";
import {
  useParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { setFormLoading } from "../../features/slices/loading";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import useValidInputHandler from "../../appHooks/useValidInputHandler";
import useRequestErrorHandler from "../../appHooks/useRequestErrorHandler";
import { useQuery } from "@tanstack/react-query";
import useLoading from "../../appHooks/useLoading";

// custom hook for react component that contains form to join a group
const useGroupRequest = () => {
  const { id } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();

  const username = useAppSelector((store) => store.user.user?.username);

  // on initial render, retrieves group information needed for clear form instructions
  const {
    data: { title, host },
    isLoading,
    isLoadingError,
    error,
  } = useQuery({
    queryKey: ["currentGroup", { id }],
    queryFn: () => groupConversationsAPI.getGroupSimple(id!),
    initialData: { title: "", host: "" },
    retry: 0,
  });

  // sets a reference
  const originalData = useRef<GroupRequestFormData>({
    to: host,
    from: username!,
    content: "",
  });

  const [formData, setFormData] = useState<GroupRequestFormData>(
    originalData.current,
  );

  // reusable custom validator hook for setting and checking input value validity
  const {
    validInputs,
    showDirections,
    currentErrorFlash,
    handleInputValidity,
    handleSubmitValidity,
    handleDirectionsFocus,
    handleDirectionsBlur,
    handleClientFlashError,
  } = useValidInputHandler(originalData.current);

  // hook for handling the initial mount error and error after submitting a new request
  const { handleMountRequestError, handleSubmitRequestError } =
    useRequestErrorHandler();

  // reusable hook that displays loading message when fetching group data
  useLoading({ isFetching: isLoading });

  // on initial mount, if an error occurs, this hook callback should redirect the user
  // to the error page
  useEffect(() => {
    if (isLoadingError && error) handleMountRequestError(error);
  }, [isLoadingError, error]);

  // updates form data state and checks input value validity when any input value changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData],
  );

  // if all inputs are valid, creates and returns new request to join group, also emits socket signal
  // to host of the group and adds request to their inbox
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (handleSubmitValidity() && id) {
          dispatch(setFormLoading(true));

          await groupRequestsAPI.sendRequest(id, formData);

          navigate(`/groups/${id}`);
        } else {
          handleClientFlashError();
        }
      } catch (err: any) {
        handleSubmitRequestError(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData, validInputs, dispatch],
  );

  return {
    formData,
    title,
    host,
    validInputs,
    showDirections,
    currentErrorFlash,
    handleChange,
    handleSubmit,
    handleDirectionsFocus,
    handleDirectionsBlur,
  };
};

export default useGroupRequest;
