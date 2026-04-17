import type { GroupUser, GroupUserTab } from "./userTypes";
import type { ConversationMessage } from "./conversationTypes";

export type NewGroup = {
  title: string;
  description: string;
  interests: number[];
};

export type showResults = "" | "title" | "host" | "user";

export type GroupSearchCard = {
  id: string;
  title: string;
  host: string;
  interests: string[];
  users: GroupUser[];
  handleGroupSearchCardKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string,
  ) => void;
  handleGroupSearchCardKeyUp: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

export type GroupSearch = {
  title: string;
  host: string;
  user: string;
  similarInterests: boolean;
  newGroups: boolean;
};

export type GroupSearchParams = {
  title: string | null;
  host: string | null;
  user: string | null;
  similarInterests: boolean | null;
  newGroups: boolean | null;
};

export type SimpleGroup = {
  id: string;
  title: string;
};

export type GroupName = { title: string; host: string };

export type SelectedGroup = { id: string; title: string; host: string };

export type HostedGroupCard = {
  id: string;
  title: string;
  createdAt: string;
};

export type NonHostedGroupCard = {
  id: string;
  title: string;
  host: string;
  createdAt: string;
};

export type AllGroups = {
  hostedGroups: HostedGroupCard[];
  nonHostedGroups: NonHostedGroupCard[];
};

export type GroupPage = {
  id: string;
  title: string;
  description: string;
  host: string;
  createdAt: string;
  users: GroupUser[];
  interests: string[];
};

export type GroupInvitation = {
  to: string;
  group: string;
  content: string;
};

export type GroupTab = {
  id: string;
  title: string;
  host: string;
  unreadMessages: number;
};

export type GroupMessageInfo = {
  users: GroupUserTab[];
  messages: ConversationMessage[];
  title: string;
  host: string;
  unreadMessages: number;
};
