import type { groupUser, groupUserTab } from "./userTypes";
import type { conversationMessage } from "./conversationTypes";

export type newGroup = {
  title: string;
  description: string;
  interests: number[];
};

export type showResults = "" | "title" | "host" | "user";

export type groupSearchCard = {
  id: string;
  title: string;
  host: string;
  interests: string[];
  users: groupUser[];
  handleGroupSearchCardKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string,
  ) => void;
  handleGroupSearchCardKeyUp: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

export type groupSearchParams = {
  title: showResults extends "title" ? string : "";
  host: showResults extends "host" ? string : "";
  user: showResults extends "user" ? string : "";
  similarInterests: boolean;
  newGroups: boolean;
};

export type simpleGroup = {
  id: string;
  title: string;
};

export type groupName = { title: string; host: string };

export type selectedGroup = { id: string; title: string; host: string };

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
  group: string;
  content: string;
};

export type groupTab = {
  id: string;
  title: string;
  host: string;
  unreadMessages: number;
};

export type groupMessageInfo = {
  users: groupUserTab[];
  messages: conversationMessage[];
  title: string;
  host: string;
  unreadMessages: number;
};
