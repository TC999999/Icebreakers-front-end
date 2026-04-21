import type { GroupUser, GroupUserTab } from "./userTypes";
import type { ConversationMessage } from "./conversationTypes";

// NEW GROUP FORM DATA
export type NewGroup = {
  title: string;
  description: string;
  interests: number[];
};

// GROUP SEARCH TYPES
export type showResults = "" | "title" | "host" | "user";

export interface BaseGroupSearch {
  title: string;
  host: string;
}

export interface GroupSearch extends BaseGroupSearch {
  user: string;
  similarInterests: boolean;
  newGroups: boolean;
}

export interface GroupSearchCard extends BaseGroupSearch {
  id: string;
  interests: string[];
  users: GroupUser[];
  handleGroupSearchCardKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string,
  ) => void;
  handleGroupSearchCardKeyUp: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export type GroupSearchParams = {
  title: string | null;
  host: string | null;
  user: string | null;
  similarInterests: boolean | null;
  newGroups: boolean | null;
};

// USED FOR CHECKLISTS
export interface SimpleGroup {
  id: string;
  title: string;
}

export interface SelectedGroup extends SimpleGroup {
  host: string;
}

// USER GROUP CARDS
export interface HostedGroupCard extends SimpleGroup {
  createdAt: string;
}

export interface NonHostedGroupCard extends HostedGroupCard, SelectedGroup {}

export type AllGroups = {
  hostedGroups: HostedGroupCard[];
  nonHostedGroups: NonHostedGroupCard[];
};

// GROUP PAGE TYPES
export interface GroupPage extends NonHostedGroupCard {
  description: string;
  users: GroupUser[];
  interests: string[];
}

export type GroupInvitation = {
  to: string;
  group: string;
  content: string;
};

export interface GroupTab extends SelectedGroup {
  unreadMessages: number;
}

export interface GroupMessageInfo extends BaseGroupSearch {
  users: GroupUserTab[];
  messages: ConversationMessage[];
  unreadMessages: number;
}
