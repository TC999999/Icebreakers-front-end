import type { sentRequestCard } from "../types/requestTypes";

const removeSentRequest = (
  id: number,
  sentRequestsSetter: React.Dispatch<React.SetStateAction<sentRequestCard[]>>
): void => {
  sentRequestsSetter((prev) => {
    return prev.filter((r) => {
      r.id !== id;
    });
  });
};

export default removeSentRequest;
