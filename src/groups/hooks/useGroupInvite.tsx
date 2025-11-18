import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import type { simpleGroup, GroupInvitation } from "../../types/groupTypes";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import groupRequestsAPI from "../../apis/groupRequestsAPI";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import socket from "../../helpers/socket";
import useValidInputHandler from "../../appHooks/useValidInputHandler";
import { toast } from "react-toastify";

// hook for page with form to create a group invitation
const useGroupInvite = () => {
  const from = useAppSelector((store) => {
    return store.user.user?.username;
  });
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const notify = (message: string) => toast.error(message);

  const { to } = useParams();
  const originalData = useRef<GroupInvitation>({
    to: "",
    from: "",
    content: "",
    group: "",
  });

  const [formData, setFormData] = useState<GroupInvitation>(
    originalData.current
  );

  const [groupList, setGroupList] = useState<simpleGroup[]>([]);

  // reusable hook for setting and checking input validity
  const {
    validInputs,
    currentErrorFlash,
    showDirections,
    handleInputValidity,
    handleDirectionsFocus,
    handleDirectionsEnter,
    handleDirectionsBlur,
    handleDirectionsExit,
    handleSubmitValidity,
    handleClientFlashError,
  } = useValidInputHandler(originalData.current);

  // on initial render, updates form data and original form data if both username in redux state
  // and url params exist, also sets the group list state with a list of groups that the current
  // user is in
  useEffect(() => {
    if (from && to) {
      setFormData((prev) => ({ ...prev, from, to }));
      originalData.current = { ...originalData.current, from, to };
      const getGroups = async () => {
        const groups = await groupConversationsAPI.getAllGroups(from, {
          getSingle: true,
        });
        if (Array.isArray(groups)) setGroupList(groups);
      };
      getGroups();
    }
  }, []);

  // updates form data state and input value validity state when input value changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData]
  );

  // if form data values are all valid, sends form data to backend to create new group invitation
  // for another user and emits a socket signal to that other user with that new request; otherwise,
  // causes invalid inputs to flash red form 0.5 seconds
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (handleSubmitValidity()) {
          dispatch(setFormLoading(true));

          const invitation = await groupRequestsAPI.sendGroupInvitation(
            formData
          );
          socket.emit("addRequest", {
            requestType: "group-invites-received",
            countType: "receivedGroupInvitationCount",
            to: formData.to,
            request: invitation,
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
    [formData, validInputs]
  );

  return {
    formData,
    groupList,
    validInputs,
    currentErrorFlash,
    showDirections,
    handleChange,
    handleSubmit,
    handleDirectionsFocus,
    handleDirectionsEnter,
    handleDirectionsBlur,
    handleDirectionsExit,
  };
};

export default useGroupInvite;
