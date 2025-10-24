import type { interestMap } from "./interestTypes";

export type newGroup = {
  title: string;
  description: string;
  host: string;
  interests: interestMap;
};

export type hostedGroupCard = {
  id: number;
  title: string;
  createdAt: string;
};

export type nonHostedGroupCard = {
  id: number;
  title: string;
  host: string;
  createdAt: string;
};

export type allGroups = {
  hostedGroups: hostedGroupCard[];
  nonHostedGroups: nonHostedGroupCard[];
};
