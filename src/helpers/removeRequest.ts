import React from "react";
import type { receivedRequestCard } from "../types/requestTypes";

const removeRequestFromRequested = (
  requesterUser: string,
  receivedRequestsSetter: React.Dispatch<
    React.SetStateAction<receivedRequestCard[]>
  >
): void => {
  receivedRequestsSetter((prev) =>
    prev.filter((request) => {
      return request.requesterUser !== requesterUser;
    })
  );
};

export default removeRequestFromRequested;
