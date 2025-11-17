import type { validity, validityTypes } from "../types/errorsTypes";
import {
  validityCheckersTrue,
  validityCheckersFalse,
} from "./maps/validMessage";
import type { FormData } from "../types/miscTypes";

// helper function that checks initial form data and creates an initial validity value map
// and error flash map based on initial data keys and map of validity parameter values
// for example, if initial form data is
// { username: "",
//   password: "",
//   emailAddress: "",
//   biography: "",
//   favoriteColor: "#000000",
//   interests: [] },
// then the return ErrorMap is
//{ username: {
//    lengthValid: false,
//    characterValid: false,
//    },
//  password: {
//    lengthValid: false,
//    characterValid: false,
//    },
//  emailAddress: {
//    lengthValid: true
//    },
//  biography: {
//    lengthValid: false,
//    characterValid: false,
//    },
//   favoriteColor: {
//    lengthValid: true
//    },
//   interests: {
//    lengthValid: false
//    }
//}
// and the return ErrorFlash is
// { username: false,
//   password: false,
//   emailAddress: false,
//   biography: false,
//   favoriteColor: false,
//   interests: false }
export const constructErrorMap = (formData: FormData) => {
  let ErrorMap: validityTypes = {};
  let ErrorFlash: validity = {};

  for (let d in formData) {
    if (!formData[d].length) {
      ErrorMap[d] = validityCheckersFalse[d];
    } else {
      ErrorMap[d] = validityCheckersTrue[d];
    }

    ErrorFlash[d] = false;
  }

  return { ErrorMap, ErrorFlash };
};
