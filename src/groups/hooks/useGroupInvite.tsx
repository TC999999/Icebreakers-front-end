import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import type { simpleGroup, GroupInvitation } from "../../types/groupTypes";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import socket from "../../helpers/socket";

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
  const [groupList, setGroupList] = useState<simpleGroup[]>([]);

  useEffect(() => {
    if (from && to) {
      setFormData((prev) => ({ ...prev, from, to }));
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
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData]
  );

  // handles submission of form data
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        dispatch(setFormLoading(true));

        const invitation = await groupConversationsAPI.sendInvitation(formData);
        socket.emit("addRequest", {
          requestType: "group-invites-received",
          countType: "receivedGroupInvitationCount",
          to: formData.to,
          request: invitation,
        });
        navigate(`/user/${to}`);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData]
  );

  return { formData, groupList, handleChange, handleSubmit };
};

export default useGroupInvite;
