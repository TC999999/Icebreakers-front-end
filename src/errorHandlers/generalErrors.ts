import { isEmail } from "validator";
import type { validityTypes } from "../types/errorsTypes";

export const setUsernameValidity = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<validityTypes>>
): void => {
  setter((prev) => ({
    ...prev,
    username: {
      ...prev.username,
      lengthValid: value.length > 5 && value.length < 30,
      characterValid: /^[\w]+$/i.test(value),
    },
  }));
};

export const setPasswordValidity = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<validityTypes>>
): void => {
  setter((prev) => ({
    ...prev,
    password: {
      ...prev.password,
      lengthValid: value.length > 15 && value.length < 30,
      characterValid: /^[\w!?]+$/i.test(value),
    },
  }));
};

export const setEmailValidity = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<validityTypes>>
): void => {
  setter((prev) => ({
    ...prev,
    emailAddress: {
      ...prev.emailAddress,
      addressValid: isEmail(value),
    },
  }));
};

export const setBiographyValidity = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<validityTypes>>
): void => {
  setter((prev) => ({
    ...prev,
    biography: {
      ...prev.biography,
      lengthValid: value.length > 20 && value.length < 200,
      characterValid: /^[\w.,?!/& ]+$/i.test(value),
    },
  }));
};

export const setInterestsValidity = (
  value: number[],
  setter: React.Dispatch<React.SetStateAction<validityTypes>>
): void => {
  setter((prev) => ({
    ...prev,
    interests: {
      ...prev.interests,
      lengthValid: value.length >= 1,
    },
  }));
};

export const setContentValidity = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<validityTypes>>
): void => {
  setter((prev) => ({
    ...prev,
    content: {
      ...prev.content,
      lengthValid: value.length > 20 && value.length < 200,
      characterValid: /^[\w.,?!/& ]+$/i.test(value),
    },
  }));
};
