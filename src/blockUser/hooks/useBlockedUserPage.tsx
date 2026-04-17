import { useEffect, useState, useCallback } from "react";
import blockAPI from "../../apis/blockAPI";
import { useParams } from "react-router-dom";
import type { BlockedUser } from "../../types/userTypes";
import { useAppDispatch } from "../../features/hooks";
import { setFormLoading, setLoadError } from "../../features/slices/loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// custom hook that handles logic for user block list page; includes retrieval of a list of
// all users blocked by current user and allows user to unblock a user on list
const useBlockedUserPage = () => {
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = (message: string) => toast.error(message);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

  // on initial render, retrieves list of all users that have been blocked by a single user;
  // throws an error if username in params does not match username saved on the server side
  useEffect(() => {
    const getBlockedUsers = async () => {
      try {
        dispatch(setFormLoading(true));
        if (username) {
          const newBlockedUsers = await blockAPI.getBlockedUsers(username);
          setBlockedUsers(newBlockedUsers);
        }
      } catch (err: any) {
        let error = JSON.parse(err.message);
        dispatch(setLoadError(error));
        navigate("/error");
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getBlockedUsers();
  }, []);

  // handles the un blocking of a single user: removes them from list and removes blocking
  // data saved in database
  const unblockUser = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      blockedUser: string,
    ): Promise<void> => {
      e.preventDefault();
      try {
        if (username) {
          await blockAPI.unblockUser(username, blockedUser);
          setBlockedUsers((prev) =>
            prev.filter((user) => {
              return user.username !== blockedUser;
            }),
          );
        }
      } catch (err: any) {
        const error = JSON.parse(err.message);
        notify(error.message);
      }
    },
    [blockedUsers],
  );
  return { blockedUsers, unblockUser };
};

export default useBlockedUserPage;
