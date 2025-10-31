import type { interestMap } from "./interestTypes";
import type { groupUser } from "./userTypes";

export type newGroup = {
  title: string;
  description: string;
  host: string;
  interests: interestMap;
};

export type simpleGroup = {
  id: string;
  title: string;
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

export type GroupInvitation = {
  to: string;
  from: string;
  group: string;
  content: string;
};

export type fromGroupInvitationCard = {
  content: string;
  createdAt: string;
  groupID: string;
  groupTitle: string;
  id: string;
  from: string;
};

export type sentGroupInvitationCard = {
  content: string;
  createdAt: string;
  groupID: string;
  groupTitle: string;
  id: string;
  to: string;
};

export type fullGroupCard = {
  content: string;
  createdAt: string;
  groupID: string;
  groupTitle: string;
  id: string;
  from: string;
  to: string;
};
