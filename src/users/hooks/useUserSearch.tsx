import { useState, useEffect, useRef } from "react";
import { type UserCard } from "../../types/userTypes";
import userAPI from "../../apis/userAPI";

const useUserSearch = () => {
  const initialUsers = useRef<UserCard[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<UserCard[]>([]);

  useEffect(() => {
    const getUsernames = async () => {
      const users = await userAPI.getUserNames();
      setSearchedUsers(users);
      initialUsers.current = users;
    };

    getUsernames();
  }, []);

  return { searchedUsers };
};

export default useUserSearch;
