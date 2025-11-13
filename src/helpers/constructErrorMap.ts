import type { validity, validityTypes } from "../types/errorsTypes";
import {
  validityCheckersTrue,
  validityCheckersFalse,
} from "./maps/validMessage";
import type { FormData } from "../types/miscTypes";

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
