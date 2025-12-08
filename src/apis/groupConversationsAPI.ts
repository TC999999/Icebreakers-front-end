import API from "./api";
import type {
  newGroup,
  allGroups,
  GroupPage,
  simpleGroup,
  groupSearchCard,
  groupName,
  groupTab,
  groupMessageInfo,
} from "../types/groupTypes";
import type {
  conversationMessage,
  newConversationMessage,
} from "../types/conversationTypes";
import type { groupMessageUserUpdate } from "../types/userTypes";

type returnGroup = {
  group: GroupPage | groupName;
  isInGroup?: boolean;
  requestPending?: boolean;
  invitationPending?: boolean;
};

type returnMessage = {
  message: conversationMessage;
  users: groupMessageUserUpdate[];
};

// API class for group conversations, including getting all current groups a user is a part of,
// getting all groups that match search params, and getting information for a single group
// extends from the basic API class
class groupConversationsAPI extends API {
  // initial backend route endpoint
  public static route = "groupMessage";

  // creates and returns a new group conversation where the inputted user is the host
  public static async createConversation(username: string, group: newGroup) {
    const res = await this.postRequest(`new/${username}`, group);
    return res;
  }

  // gets all groups that the user is a part of, returns either a simpler or more complex version of
  // the list based on inputted params
  public static async getAllGroups(
    username: string,
    params: any
  ): Promise<allGroups | simpleGroup[]> {
    const res = await this.getRequest(username, params);
    return res.groups;
  }

  // gets an initial list of group names and their hosts
  public static async getAllGroupNames(): Promise<groupName[]> {
    const res = await this.getRequest("getNames");
    return res.groups;
  }

  // returns information for a single group, gets either a simpler or more complex list of data based
  // on getSimple input
  public static async getGroup(
    id: string,
    getSimple: boolean = false
  ): Promise<returnGroup> {
    const res = await this.getRequest(`id/${id}`, { getSimple });
    return res;
  }

  // returns a list of groups based on inputted search params
  public static async searchGroups(params: any): Promise<groupSearchCard[]> {
    const res = await this.getRequest("search", params);
    return res.groups;
  }

  // returns a list of group tabs for the group conversation page
  public static async getGroupTabs(username: string): Promise<groupTab[]> {
    const res = await this.getRequest(`${username}/tabs`);
    return res.groups;
  }

  // returns a list of group members other than current user and group messages for a
  // group conversation for the group conversation page
  public static async getGroupMessages(
    username: string,
    id: string,
    unreadGroupMessages: number
  ): Promise<groupMessageInfo> {
    const res = await this.getRequest(`${username}/message/${id}`, {
      unreadGroupMessages,
    });
    return res;
  }

  // creates and returns a new message in a group conversation for group with inputted id and
  // from the user with the inputted username
  public static async createGroupMessage(
    username: string,
    id: string,
    message: newConversationMessage
  ): Promise<returnMessage> {
    const res = await this.postRequest(`${username}/message/${id}`, message);
    return res;
  }
}

export default groupConversationsAPI;
