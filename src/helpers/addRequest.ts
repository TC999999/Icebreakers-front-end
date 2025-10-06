import React from "react";
import type { receivedRequest } from "../types/requestTypes";

const addRequest = (
  request: receivedRequest,
  receivedRequestsSetter: React.Dispatch<
    React.SetStateAction<receivedRequest[]>
  >
): void => {
  receivedRequestsSetter((prev) => {
    return [...prev, request];
  });
};

export default addRequest;
