import { useEffect, useState, useRef, useCallback } from "react";
import type {
  groupSearchCard,
  groupSearchParams,
  groupName,
} from "../../types/groupTypes";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import userAPI from "../../apis/userAPI";
import { useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import { useSearchParams } from "react-router-dom";

type showResults = "" | "title" | "host" | "user";

const useGroupSearchPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [groupSearchParams, setGroupSearchParams] = useState<groupSearchParams>(
    { title: "", host: "", user: "", similarInterests: false, newGroups: false }
  );
  const originalGroups = useRef<groupName[]>([]);
  const [showResults, setShowResults] = useState<showResults>("");
  const [groupSearchResults, setGroupSearchResults] = useState<groupName[]>([]);
  const initialUsers = useRef<string[]>([]);
  const [hostSearchResults, setHostSearchResults] = useState<string[]>([]);
  const [userSearchResults, setUserSearchResults] = useState<string[]>([]);
  const [currentGroups, setCurrentGroups] = useState<groupSearchCard[]>([]);

  useEffect(() => {
    try {
      dispatch(setFormLoading(true));
      const getAllGroups = async () => {
        let params = Object.fromEntries(searchParams.entries());

        setGroupSearchParams((prev) => ({
          ...prev,
          ...params,
          similarInterests: params.similarInterests === "true",
          newGroups: params.newGroups === "true",
        }));
        const groups = await groupConversationsAPI.searchGroups(params);
        const groupNames = await groupConversationsAPI.getAllGroupNames();
        originalGroups.current = groupNames;
        const allUsernames = await userAPI.getUserNames();
        initialUsers.current = allUsernames;
        setCurrentGroups(groups);
        setGroupSearchResults(groupNames);
        setHostSearchResults(allUsernames);
        setUserSearchResults(allUsernames);
      };
      getAllGroups();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setFormLoading(false));
    }
  }, []);

  const handleGroupSearchResults = (value: string) => {
    setGroupSearchResults(
      originalGroups.current.filter((g) => {
        return g.title.startsWith(value);
      })
    );
  };

  const handleUserSearchResults = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setter(
      initialUsers.current.filter((u) => {
        return u.startsWith(value);
      })
    );
  };

  const handleDivFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      let s = e.currentTarget.title;
      if (s === "title" || s === "host" || s === "user") {
        setShowResults(s);
      }
    },
    [showResults]
  );

  const handleDivBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      e.preventDefault();

      setShowResults("");
    },
    [showResults]
  );

  const handleResults = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      let s = e.currentTarget.title;
      setGroupSearchParams((prev) => ({
        ...prev,
        [showResults]: s,
      }));

      switch (showResults) {
        case "title":
          handleGroupSearchResults(s);
          break;
        case "host":
          handleUserSearchResults(setHostSearchResults, s);
          break;
        case "user":
          handleUserSearchResults(setUserSearchResults, s);
          break;
      }

      setShowResults("");
    },
    [showResults, groupSearchParams]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked, type } = e.target;
      switch (name) {
        case "title":
          value ? handleGroupSearchResults(value) : setGroupSearchResults([]);
          break;
        case "host":
          value
            ? handleUserSearchResults(setHostSearchResults, value)
            : setHostSearchResults([]);
          break;
        case "user":
          value
            ? handleUserSearchResults(setUserSearchResults, value)
            : setUserSearchResults([]);
          break;
      }
      setGroupSearchParams((prev) => ({
        ...prev,
        [name]: type === "search" ? value : checked,
      }));
    },
    [groupSearchParams]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        dispatch(setFormLoading(true));
        let newParams = Object.fromEntries(
          Object.entries(groupSearchParams).filter((p) => {
            return p[1];
          })
        );

        const groups = await groupConversationsAPI.searchGroups(newParams);
        setCurrentGroups(groups);
        setSearchParams((prev) => ({ ...prev, ...newParams }));
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [groupSearchParams]
  );

  return {
    currentGroups,
    groupSearchParams,
    groupSearchResults,
    hostSearchResults,
    userSearchResults,
    showResults,
    handleChange,
    handleDivFocus,
    handleDivBlur,
    handleResults,
    handleSubmit,
  };
};

export default useGroupSearchPage;
