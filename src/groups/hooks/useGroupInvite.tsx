import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import type { simpleGroup, GroupInvitation } from "../../types/groupTypes";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import socket from "../../helpers/socket";
import useValidInputHandler from "../../appHooks/useValidInputHandler";

const useGroupInvite = () => {
  const from = useAppSelector((store) => {
    return store.user.user?.username;
  });
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();

  const { to } = useParams();
  const initialData: GroupInvitation = {
    to: "",
    from: "",
    content: "",
    group: "",
  };

  const [formData, setFormData] = useState<GroupInvitation>(initialData);
  const originalData = useRef<GroupInvitation>(initialData);
  const [groupList, setGroupList] = useState<simpleGroup[]>([]);

  const {
    validInputs,
    currentErrorFlash,
    showDirections,
    handleInputValidity,
    handleMouseEnter,
    handleMouseExit,
    handleSubmitValidity,
    handleClientFlashError,
  } = useValidInputHandler(originalData.current);

  useEffect(() => {
    if (from && to) {
      setFormData((prev) => ({ ...prev, from, to }));
      originalData.current = { ...initialData, from, to };
      const getGroups = async () => {
        const groups = await groupConversationsAPI.getAllGroups(from, {
          getSingle: true,
        });
        if (Array.isArray(groups)) setGroupList(groups);
      };
      getGroups();
    }
  }, []);

  // handles change in value of form data
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData]
  );

  // handles submission of form data
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (handleSubmitValidity()) {
          dispatch(setFormLoading(true));

          const invitation = await groupConversationsAPI.sendInvitation(
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
    groupList,
    validInputs,
    currentErrorFlash,
    showDirections,
    handleChange,
    handleSubmit,
    handleMouseEnter,
    handleMouseExit,
  };
};

export default useGroupInvite;
