import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { shallowEqual } from "react-redux";
import type { groupUser } from "../../types/userTypes";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import { setFormLoading, setLoadError } from "../../features/slices/auth";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../../helpers/socket";

const useDeleteGroupMembers = () => {
  const username = useAppSelector(
    (store) => store.user.user?.username,
    shallowEqual
  );
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = (message: string) => toast.error(message);

  const [users, setUsers] = useState<groupUser[]>([]);
  const [groupTitle, setGroupTitle] = useState<string>("");
  const [showRemoveWindow, setShowRemoveWindow] = useState<boolean>(false);
  const [currentRemovedUser, setCurrentRemovedUser] = useState<string>("");

  useEffect(() => {
    const getGroupUsers = async () => {
      try {
        dispatch(setFormLoading(true));
        if (username && id) {
          const { users, title } =
            await groupConversationsAPI.getGroupMemberDeleteInfo(username, id);
          setGroupTitle(title);

          setUsers(users);
        }
      } catch (err: any) {
        let error = JSON.parse(err.message);
        dispatch(setLoadError(error));
        navigate("/error");
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getGroupUsers();
  }, []);

  const handleRemoveButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, username: string) => {
      e.preventDefault();
      setShowRemoveWindow(!showRemoveWindow);
      setCurrentRemovedUser(showRemoveWindow ? "" : username);
    },
    [showRemoveWindow, currentRemovedUser]
  );

  const handleRemoveUser = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>, removedUser: string) => {
      e.preventDefault();
      try {
        dispatch(setFormLoading(true));

        if (id && username) {
          const { unreadGroupMessages } =
            await groupConversationsAPI.removeGroupMember(
              username,
              id,
              removedUser
            );

          setShowRemoveWindow(false);
          setCurrentRemovedUser("");
          setUsers((prev) => prev.filter((u) => u.username !== removedUser));
          socket.emit("removeFromGroup", {
            to: removedUser,
            groupID: id,
            unreadGroupMessages,
          });
        }
      } catch (err: any) {
        notify(JSON.parse(err.message).message);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [showRemoveWindow, currentRemovedUser]
  );

  return {
    users,
    groupTitle,
    showRemoveWindow,
    currentRemovedUser,
    handleRemoveButton,
    handleRemoveUser,
  };
};

export default useDeleteGroupMembers;
