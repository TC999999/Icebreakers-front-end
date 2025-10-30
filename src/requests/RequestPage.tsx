import { type JSX } from "react";
import useRequestPage from "./hooks/useRequestPage";
import RequestForm from "./RequestForm";

const RequestPage = (): JSX.Element => {
  const { to, from } = useRequestPage();
  return (
    <div>
      <RequestForm to={to!} from={from!} />
    </div>
  );
};

export default RequestPage;
