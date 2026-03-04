import { useEffect } from "react";
import { useAppDispatch } from "../features/hooks";
import type { AppDispatch } from "../features/store";
import { setFormLoading } from "../features/slices/loading";

type Props = { isFetching: boolean };

// custom reusable hook that updates redux loading state based on boolean props for if the
// app is fetching data from tbe backend
const useLoading = ({ isFetching }: Props) => {
  const dispatch: AppDispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setFormLoading(isFetching));
  }, [isFetching]);
};

export default useLoading;
