import { type JSX } from "react";
import useRequestPage from "./hooks/useRequestPage";
import RequestForm from "./RequestForm";

const RequestPage = (): JSX.Element => {
  const { requestedUser, requesterUser } = useRequestPage();
  return (
    <div>
      <RequestForm
        requestedUser={requestedUser!}
        requesterUser={requesterUser!}
      />
    </div>
  );
};

export default RequestPage;
