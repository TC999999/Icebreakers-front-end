import { type JSX } from "react";
import useRequestPage from "./hooks/useRequestPage";
import RequestForm from "./RequestForm";

// React component for direct request form component wrapper
const RequestPage = (): JSX.Element => {
  const { to, from } = useRequestPage();
  return (
    <div>
      <RequestForm to={to!} from={from!} />
    </div>
  );
};

export default RequestPage;
