import React from "react";
import type { receivedRequest } from "../types/requestTypes";

const removeRequestFromRequested = (
  requesterUser: string,
  receivedRequestsSetter: React.Dispatch<
    React.SetStateAction<receivedRequest[]>
  >
): void => {
  receivedRequestsSetter((prev) =>
    prev.filter((request) => {
      return request.requesterUser !== requesterUser;
    })
  );
};

export default removeRequestFromRequested;
