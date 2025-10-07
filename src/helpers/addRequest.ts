import React from "react";
import type { receivedRequestCard } from "../types/requestTypes";

const addRequest = (
  request: receivedRequestCard,
  receivedRequestsSetter: React.Dispatch<
    React.SetStateAction<receivedRequestCard[]>
  >
): void => {
  receivedRequestsSetter((prev) => {
    return [...prev, request];
  });
};

export default addRequest;
