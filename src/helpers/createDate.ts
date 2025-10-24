import { DateTime } from "luxon";

type dateType = "long" | "short";

const getDateString = (type: dateType): string => {
  switch (type) {
    case "long":
      return "LLLL d, yyyy 'at' h:mm a";
    case "short":
      return "MM/dd/yy, h:mm a";
  }
};

const createDate = (date: string, type: dateType) => {
  return DateTime.fromISO(date).toFormat(getDateString(type));
};

export default createDate;
