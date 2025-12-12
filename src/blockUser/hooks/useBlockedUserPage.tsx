import { useEffect, useState, useCallback } from "react";
import blockAPI from "../../apis/blockAPI";
import { useParams } from "react-router-dom";
import type { blockedUser } from "../../types/userTypes";
import { useAppDispatch } from "../../features/hooks";
import { setLoadError } from "../../features/slices/auth";
import { useNavigate } from "react-router-dom";

// custom hook that handles logic for user block list page; includes retrieval of a list of
// all users blocked by current user and allows user to unblock a user on list
const useBlockedUserPage = () => {
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState<blockedUser[]>([]);

  // on initial render, retrieves list of all users that have been blocked by a single user;
  // throws an error if username in params does not match username saved on the server side
  useEffect(() => {
    const getBlockedUsers = async () => {
      try {
        if (username) {
          const newBlockedUsers = await blockAPI.getBlockedUsers(username);
          setBlockedUsers(newBlockedUsers);
        }
      } catch (err: any) {
        let error = JSON.parse(err.message);
        dispatch(setLoadError(error));
        navigate("/error");
      }
    };

    getBlockedUsers();
  }, []);

  // handles the un blocking of a single user: removes them from list and removes blocking
  // data saved in database
  const unblockUser = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      blockedUser: string
    ): Promise<void> => {
      e.preventDefault();
      if (username) {
        await blockAPI.unblockUser(username, blockedUser);

        setBlockedUsers((prev) =>
          prev.filter((user) => {
            return user.username !== blockedUser;
          })
        );
      }
    },
    [blockedUsers]
  );
  return { blockedUsers, unblockUser };
};

export default useBlockedUserPage;
