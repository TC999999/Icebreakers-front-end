import React from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaCircleXmark } from "react-icons/fa6";
import type { validity } from "./types/errorsTypes";
import { validMessages } from "./helpers/maps/validMessage";

type Props = {
  type:
    | "username"
    | "password"
    | "emailAddress"
    | "biography"
    | "interests"
    | "content";
  showDirections: string;
  validInputs: validity;
  onBottom: boolean;
};

const InputDirections: React.FC<Props> = ({
  type,
  showDirections,
  validInputs,
  onBottom,
}) => {
  return type === showDirections ? (
    <div className={`input-directions ${onBottom ? "onBottom" : ""}`}>
      <ul>
        {Object.entries(validInputs).map((kv, i) => {
          return (
            <li key={`direction-type=${i}`}>
              {validInputs[kv[0]] ? (
                <IoMdCheckmarkCircle className="directions-check" />
              ) : (
                <FaCircleXmark className="directions-x" />
              )}

              {validMessages[type][kv[0]]}
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
};

export default InputDirections;
