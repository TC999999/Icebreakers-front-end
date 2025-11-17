import { DateTime } from "luxon";

type dateType = "long" | "short";

// returns either longer or shorter converstion string based on input parameter
const getDateString = (type: dateType): string => {
  switch (type) {
    case "long":
      return "LLLL d, yyyy 'at' h:mm a";
    case "short":
      return "MM/dd/yy, h:mm a";
  }
};

// returns a string to convert an ISO date to a readable date string
const createDate = (date: string, type: dateType) => {
  return DateTime.fromISO(date).toFormat(getDateString(type));
};

export default createDate;
