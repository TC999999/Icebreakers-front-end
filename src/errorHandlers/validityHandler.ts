import type { validityTypes, errorFlash } from "../types/errorsTypes";
import {
  setUsernameValidity,
  setPasswordValidity,
  setEmailValidity,
  setBiographyValidity,
  setInterestsValidity,
} from "./generalErrors";

type errorInput = {
  name: string;
  value: string | number[];
  setter: React.Dispatch<React.SetStateAction<validityTypes>>;
};

export const inputValidityHandler = ({ name, value, setter }: errorInput) => {
  switch (name) {
    case "username":
      if (typeof value === "string") setUsernameValidity(value, setter);
      break;

    case "password":
      if (typeof value === "string") setPasswordValidity(value, setter);
      break;

    case "emailAddress":
      if (typeof value === "string") setEmailValidity(value, setter);
      break;

    case "biography":
      if (typeof value === "string") setBiographyValidity(value, setter);
      break;

    case "interests":
      if (typeof value !== "string") setInterestsValidity(value, setter);
      break;
    default:
      break;
  }
};

export const submitErrorHandler = (
  input: validityTypes,
  setter: React.Dispatch<React.SetStateAction<errorFlash>>
) => {
  let allValid: boolean[] = [];

  for (let key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      let valid = Object.values(input[key as keyof validityTypes]).every(
        (v) => {
          return v === true;
        }
      );
      allValid.push(valid);
      setter((prev) => ({ ...prev, [key]: !valid }));
    }
  }

  return allValid.every((v) => {
    return v;
  });
};
