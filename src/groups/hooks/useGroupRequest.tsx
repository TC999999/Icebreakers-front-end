import { useState, useCallback, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { GroupRequestFormData } from "../../types/requestTypes";
import type { groupName } from "../../types/groupTypes";
import groupRequestsAPI from "../../apis/groupRequestsAPI";
import {
  useParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { setFormLoading } from "../../features/slices/loading";
import socket from "../../helpers/socket";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import useValidInputHandler from "../../appHooks/useValidInputHandler";
import useRequestErrorHandler from "../../appHooks/useRequestErrorHandler";

// custom hook for react component that contains form to join a group
const useGroupRequest = () => {
  const { id } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();

  const username = useAppSelector((store) => store.user.user?.username);

  const originalData = useRef<GroupRequestFormData>({
    to: "",
    from: "",
    content: "",
  });

  const [formData, setFormData] = useState<GroupRequestFormData>(
    originalData.current,
  );
  const [groupData, setGroupData] = useState<groupName>({
    title: "",
    host: "",
  });

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

  // on initial render, retrieves group information needed for clear form instructions
  useEffect(() => {
    const getGroup = async () => {
      try {
        dispatch(setFormLoading(true));
        if (id) {
          const { group } = await groupConversationsAPI.getGroup(id, true);
          if (!("id" in group) && username) {
            setGroupData(group);
            let newFormData = {
              content: "",
              to: group.host,
              from: username,
            };
            originalData.current = newFormData;
            setFormData(newFormData);
          }
        }
      } catch (err: any) {
        handleMountRequestError(err.message);
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getGroup();
  }, []);

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
    groupData,
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
