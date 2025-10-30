import { useEffect } from "react";
import { useAppSelector } from "../../features/hooks";
import userAPI from "../../apis/userAPI";
import {
  useParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";

import { useAppDispatch } from "../../features/hooks";
import { setLoadError } from "../../features/slices/auth";
import { type AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";

const useRequestPage = () => {
  const { to } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();

  const from: string | undefined = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  useEffect(() => {
    const setPairing = async () => {
      try {
        if (to !== from) {
          await userAPI.userCheck(to!);
        } else {
          throw new Error(
            JSON.stringify({
              message: "Cannot make a chat request with yourself!",
              status: 403,
            })
          );
        }
      } catch (err: any) {
        let error = JSON.parse(err.message);
        dispatch(setLoadError(error));
        navigate("/error");
      }
    };

    setPairing();
  }, [dispatch]);

  return { to, from };
};

export default useRequestPage;
