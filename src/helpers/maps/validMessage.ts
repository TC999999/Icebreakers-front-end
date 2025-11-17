import type {
  validity,
  validityTypes,
  validMessageMap,
} from "../../types/errorsTypes";

// Map of instructions for all form input types on what parameter values their respective value needs
// to be considered valid
export const validMessages: validMessageMap = {
  username: {
    lengthValid: "Username must be between 5-30 characters.",
    characterValid: "Username may only contain letters or numbers.",
  },
  password: {
    lengthValid: "Password must be between 15-30 characters.",
    characterValid:
      "Password may only contain letters, numbers, and the following special characters (?, !).",
  },
  emailAddress: {
    addressValid: "Must be a valid email address.",
  },
  biography: {
    lengthValid: "Biography must be between 20-200 characters.",
    characterValid:
      "Biography may only contain letters, numbers, spaces, and the following special characters (?, !, ., ,, &, /)",
  },
  interests: {
    lengthValid: "Please select at least one of the interests on the list.",
  },
  content: {
    lengthValid: "Message must be between 20-200 characters.",
    characterValid:
      "Message may only contain letters, numbers, spaces, and the following special characters (?, !, ., ,, &, /)",
  },
  title: {
    lengthValid: "Group Title must be between 5-30 characters.",
    characterValid: "Group Title may only contain letters, numbers, or spaces.",
  },
  description: {
    lengthValid: "Group description must be between 20-200 characters.",
    characterValid:
      "Group description may only contain letters, numbers, spaces, and the following special characters (?, !, ., ,, &, /)",
  },

  group: {
    lengthValid: "Please choose one of the below groups!",
  },
};

// general validity parameter value for a form field input type (username, password, description,
// etc) if all initial form input values are false
let generalValidityFalse: validity = {
  lengthValid: false,
  characterValid: false,
};

// map of which validity parameter values are required for each form field input type if initial form
// input values are false
export const validityCheckersFalse: validityTypes = {
  username: generalValidityFalse,
  password: generalValidityFalse,
  emailAddress: { addressValid: false },
  biography: generalValidityFalse,
  interests: { lengthValid: false },
  favoriteColor: { lengthValid: false },
  content: generalValidityFalse,
  to: generalValidityFalse,
  from: generalValidityFalse,
  title: generalValidityFalse,
  description: generalValidityFalse,
  group: { lengthValid: false },
};

// general validity parameter value for a form field input type (username, password, description,
// etc) if all initial form input values are true
let generalValidityTrue: validity = { lengthValid: true, characterValid: true };

// map of which validity parameter values are required for each form field input type if initial form
// input values are true
export const validityCheckersTrue: validityTypes = {
  username: generalValidityTrue,
  password: generalValidityTrue,
  emailAddress: { addressValid: true },
  biography: generalValidityTrue,
  interests: { lengthValid: true },
  favoriteColor: { lengthValid: true },
  content: generalValidityTrue,
  to: generalValidityTrue,
  from: generalValidityTrue,
  title: generalValidityTrue,
  description: generalValidityTrue,
  group: { lengthValid: true },
};
