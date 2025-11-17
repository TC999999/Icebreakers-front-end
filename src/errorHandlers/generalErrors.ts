import { isEmail } from "validator";
import type { validityTypes } from "../types/errorsTypes";

// sets validity parameters state of username value if username key exists in validity state
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

// sets validity parameters state of password value if password key exists in validity state
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

// sets validity parameters state of email address value if email address key exists in validity
// state
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

// sets validity parameters state of user biography value if biography key exists in validity state
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

// sets validity parameters state of interests value if interests key exists in validity state
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

// sets validity parameters state of message content value if content key exists in validity state
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

// sets validity parameters state of group title value if title key exists in validity state
export const setTitleValidity = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<validityTypes>>
): void => {
  setter((prev) => ({
    ...prev,
    title: {
      ...prev.title,
      lengthValid: value.length > 5 && value.length < 30,
      characterValid: /^[\w ]+$/i.test(value),
    },
  }));
};

// sets validity parameters state of group description value if description key exists in
// validity state
export const setDescriptionValidity = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<validityTypes>>
): void => {
  setter((prev) => ({
    ...prev,
    description: {
      ...prev.description,
      lengthValid: value.length > 20 && value.length < 200,
      characterValid: /^[\w.,?!/& ]+$/i.test(value),
    },
  }));
};

// sets validity parameters state of group name value if group key exists in validity state
export const setGroupValidity = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<validityTypes>>
): void => {
  setter((prev) => ({
    ...prev,
    group: {
      ...prev.group,
      lengthValid: value.length > 0,
    },
  }));
};
