import { type JSX } from "react";

import useRequestPage from "./hooks/useRequestPage";
import RequestForm from "./RequestForm";

const RequestPage = (): JSX.Element => {
  const { userPair } = useRequestPage();
  return (
    <div>
      <RequestForm
        requestedUser={userPair.requestedUser}
        requesterUser={userPair.requesterUser}
      />
    </div>
  );
};

export default RequestPage;
