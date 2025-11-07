import { useState, useCallback } from "react";
import type { groupRequestFormData } from "../../types/requestTypes";
import groupRequestsAPI from "../../apis/groupRequestsAPI";
import {
  useParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { setFormLoading } from "../../features/slices/auth";
import socket from "../../helpers/socket";

const useGroupRequest = () => {
  const { id } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();

  const initialData: groupRequestFormData = { content: "" };
  const [formData, setFormData] = useState<groupRequestFormData>(initialData);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
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
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData]
  );

  return { formData, handleChange, handleSubmit };
};

export default useGroupRequest;
