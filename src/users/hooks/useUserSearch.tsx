import { useState, useEffect, useRef } from "react";
import { type UserCard } from "../../types/userTypes";
import userAPI from "../../apis/userAPI";

const useUserSearch = () => {
  const initialUsers = useRef<string[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<UserCard[]>([]);

  useEffect(() => {
    const getUsernames = async () => {
      const users = await userAPI.getUserNames();
      setSearchedUsers(users);

      initialUsers.current = users.map((u) => {
        return u.username;
      });
    };

    getUsernames();
  }, []);

  return { searchedUsers };
};

export default useUserSearch;
