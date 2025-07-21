import { type JSX } from "react";

import { useAppSelector } from "../features/hooks";
import { type ReduxAuthState } from "../types/authTypes";
import { shallowEqual } from "react-redux";

const Welcome = (): JSX.Element => {
  const { user }: ReduxAuthState = useAppSelector(
    (store) => store.user,
    shallowEqual
  );
  return <div>Welcome {user ? user.username : ""}</div>;
};

export default Welcome;
