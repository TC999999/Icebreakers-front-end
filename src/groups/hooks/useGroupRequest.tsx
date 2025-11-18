import { useState, useCallback, useEffect, useRef } from "react";
import type { groupRequestFormData } from "../../types/requestTypes";
import type { groupName } from "../../types/groupTypes";
import groupRequestsAPI from "../../apis/groupRequestsAPI";
import {
  useParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { setFormLoading } from "../../features/slices/auth";
import socket from "../../helpers/socket";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import useValidInputHandler from "../../appHooks/useValidInputHandler";
import { toast } from "react-toastify";

// custom hook for react component that contains form to join a group
const useGroupRequest = () => {
  const { id } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();
  const notify = (message: string) => toast.error(message);

  const originalData = useRef<groupRequestFormData>({ content: "" });

  const [formData, setFormData] = useState<groupRequestFormData>(
    originalData.current
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

  // on initial render, retrieves group information needed for clear form instructions
  useEffect(() => {
    const getGroup = async () => {
      try {
        dispatch(setFormLoading(true));
        if (id) {
          const { group } = await groupConversationsAPI.getGroup(id, true);
          if (!("id" in group)) setGroupData(group);
        }
      } catch (err) {
        console.log(err);
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
    [formData]
  );

  // if all inputs are valid, creates and returns new request to join group, also emits socket signal
  // to host of the group and adds request to their inbox
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (handleSubmitValidity()) {
          dispatch(setFormLoading(true));
          if (id) {
            const request = await groupRequestsAPI.sendRequest(id, formData);
            socket.emit("addRequest", {
              requestType: "group-requests-received",
              countType: "receivedGroupRequestCount",
              request,
              to: request.to,
            });
            navigate(`/groups/${id}`);
          }
        } else {
          handleClientFlashError();
        }
      } catch (err: any) {
        notify(JSON.parse(err.message).message);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData, validInputs, dispatch]
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
