import { useEffect, useState } from "react";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import type { GroupPage } from "../../types/groupTypes";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";

const useGroupPage = () => {
  const { id } = useParams();
  const dispatch: AppDispatch = useAppDispatch();

  const initialGroup: GroupPage = {
    id: "",
    title: "",
    description: "",
    host: "",
    createdAt: "",
    users: [],
    interests: [],
  };

  const [group, setGroup] = useState<GroupPage>(initialGroup);
  const [isInGroup, setIsInGroup] = useState<boolean>(false);

  useEffect(() => {
    const getGroup = async () => {
      try {
        dispatch(setFormLoading(true));
        if (id) {
          const { group, isInGroup } = await groupConversationsAPI.getGroup(id);
          setGroup(group);
          setIsInGroup(isInGroup);
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getGroup();
  }, []);
  return { group, isInGroup };
};

export default useGroupPage;
