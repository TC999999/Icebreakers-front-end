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

const useGroupRequest = () => {
  const { id } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();

  const initialData: groupRequestFormData = { content: "" };
  const [formData, setFormData] = useState<groupRequestFormData>(initialData);
  const [groupData, setGroupData] = useState<groupName>({
    title: "",
    host: "",
  });
  const originalData = useRef<groupRequestFormData>(initialData);

  const {
    validInputs,
    showDirections,
    currentErrorFlash,
    handleInputValidity,
    handleSubmitValidity,
    handleMouseEnter,
    handleMouseExit,
    handleClientFlashError,
  } = useValidInputHandler(originalData.current);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData]
  );

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
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData]
  );

  return {
    formData,
    groupData,
    validInputs,
    showDirections,
    currentErrorFlash,
    handleChange,
    handleSubmit,
    handleMouseEnter,
    handleMouseExit,
  };
};

export default useGroupRequest;
