import { useState, useEffect } from "react";
import { useAppSelector } from "../../features/hooks";
import userAPI from "../../apis/userAPI";
import {
  useParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { type directConversationRequestPair } from "../../types/requestTypes";
import { useAppDispatch } from "../../features/hooks";
import { setLoadError } from "../../features/slices/auth";
import { type AppDispatch } from "../../features/store";

const useRequestPage = () => {
  const { requestedUser } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();

  const { user } = useAppSelector((store) => {
    return store.user;
  });

  const [userPair, setUserPair] = useState<directConversationRequestPair>({
    requestedUser: "",
    requesterUser: "",
  });

  useEffect(() => {
    const setPairing = async () => {
      try {
        if (requestedUser !== user?.username) {
          await userAPI.userCheck(requestedUser!);

          setUserPair((prev) => ({
            ...prev,
            requestedUser: requestedUser!,
            requesterUser: user!.username,
          }));
        } else {
          navigate("/requestError");
        }
      } catch (err: any) {
        let error = JSON.parse(err.message);
        dispatch(setLoadError(error));
        navigate("/error");
      }
    };

    setPairing();
  }, [dispatch]);

  return { userPair };
};

export default useRequestPage;
