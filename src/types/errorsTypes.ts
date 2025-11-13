export type validity = { [key: string]: boolean };

export type validityTypes = {
  [key: string]: validity;
};

export type validityMessage = {
  [key: string]: string;
};

export type errorFlash = {
  [key: string]: boolean;
};

export type validMessageMap = {
  [key: string]: validityMessage;
};
