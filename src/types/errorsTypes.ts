export type Validity = { [key: string]: boolean };

export type ValidityTypes = {
  [key: string]: Validity;
};

export type ValidityMessage = {
  [key: string]: string;
};

export type ErrorFlash = {
  [key: string]: boolean;
};

export type ValidMessageMap = {
  [key: string]: ValidityMessage;
};
