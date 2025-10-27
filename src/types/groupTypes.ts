import type { interestMap } from "./interestTypes";
import type { groupUser } from "./userTypes";

export type newGroup = {
  title: string;
  description: string;
  host: string;
  interests: interestMap;
};

export type hostedGroupCard = {
  id: string;
  title: string;
  createdAt: string;
};

export type nonHostedGroupCard = {
  id: string;
  title: string;
  host: string;
  createdAt: string;
};

export type allGroups = {
  hostedGroups: hostedGroupCard[];
  nonHostedGroups: nonHostedGroupCard[];
};

export type GroupPage = {
  id: string;
  title: string;
  description: string;
  host: string;
  createdAt: string;
  users: groupUser[];
  interests: string[];
};
