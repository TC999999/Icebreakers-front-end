import { useState, useEffect, useRef, useCallback } from "react";
import { type UserCard, type UserSearch } from "../../types/userTypes";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { setFormLoading } from "../../features/slices/auth";
import { type AppDispatch } from "../../features/store";
import userAPI from "../../apis/userAPI";
import filterUsernames from "../../helpers/filterUsernames";

const useUserSearch = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const initialUsers = useRef<string[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<UserCard[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showResults, setShowResults] = useState<boolean>(false);

  const initialQuery: UserSearch = {
    username: "",
    findSimilarInterests: false,
  };

  const [searchQuery, setSearchQuery] = useState<UserSearch>(initialQuery);

  useEffect(() => {
    const getUsernames = async () => {
      dispatch(setFormLoading(true));
      setSearchQuery(initialQuery);
      let params = {};
      let username = searchParams.get("username");
      let findSimilarInterests = searchParams.get("findSimilarInterests");
      if (username) {
        params = { ...params, username };
        setSearchQuery((prev) => ({ ...prev, username }));
      }
      if (findSimilarInterests === "true") {
        params = { ...params, findSimilarInterests: true };
        setSearchQuery((prev) => ({ ...prev, findSimilarInterests: true }));
      }
      const allUsernames = await userAPI.getUserNames();
      initialUsers.current = allUsernames;
      setSearchResults(allUsernames);

      const users = await userAPI.searchForUsers(params);
      setSearchedUsers(users);
      dispatch(setFormLoading(false));
    };

    getUsernames();
  }, [dispatch, searchParams]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowResults(true);
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowResults(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked, type } = e.target;
      setSearchQuery((prev) => ({
        ...prev,
        [name]: type === "search" ? value : checked,
      }));
      if (type === "search")
        filterUsernames(
          value,
          initialUsers.current,
          setSearchResults,
          setShowResults
        );
    },
    [searchQuery]
  );

  const handleResults = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      let s = e.currentTarget.innerText;
      setSearchQuery((prev) => ({
        ...prev,
        username: s,
      }));
      setSearchResults([]);
      setShowResults(false);
    },
    [searchQuery.username]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(setFormLoading(true));
      try {
        let params = Object.fromEntries(
          Object.entries(searchQuery).filter((q) => {
            return q[1];
          })
        );
        setSearchParams((prev) => ({ ...prev, ...params }));
        let users = await userAPI.searchForUsers(params);
        setSearchedUsers(users);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [searchQuery]
  );

  return {
    searchResults,
    showResults,
    searchedUsers,
    searchQuery,
    handleFocus,
    handleBlur,
    handleResults,
    handleChange,
    handleSubmit,
  };
};

export default useUserSearch;
