export type registerErrorMessages = {
  username: string;
  password: string;
  emailAddress: string;
  biography: string;
  interests: string;
};

export interface interestsValidity {
  lengthValid: boolean;
}

export interface generalValidity extends interestsValidity {
  characterValid: boolean;
}

export type emailValidity = { addressValid: boolean };

export interface userValidity {
  emailAddress: { addressValid: boolean };
  biography: generalValidity;
  interests: { lengthValid: boolean };
}

export interface registerValidityTypes extends userValidity {
  username: generalValidity;
  password: generalValidity;
}

export interface userErrorFlash {
  emailAddress: boolean;
  biography: boolean;
  interests: boolean;
}

export interface registerErrorFlash extends userErrorFlash {
  username: boolean;
  password: boolean;
}
