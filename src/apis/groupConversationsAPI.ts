import API from "./api";
import type {
  NewGroup,
  AllGroups,
  GroupPage,
  SimpleGroup,
  GroupSearchCard,
  GroupName,
  GroupTab,
  GroupMessageInfo,
  GroupSearchParams,
} from "../types/groupTypes";
import type {
  ConversationMessage,
  NewConversationMessage,
} from "../types/conversationTypes";
import type { GroupMessageUserUpdate } from "../types/userTypes";

type ReturnGroup = {
  group: GroupPage | GroupName;
  isInGroup?: boolean;
  requestPending?: boolean;
  invitationPending?: boolean;
};

type ReturnMessage = {
  message: ConversationMessage;
  users: GroupMessageUserUpdate[];
};

// API class for group conversations, including getting all current groups a user is a part of,
// getting all groups that match search params, and getting information for a single group
// extends from the basic API class
class groupConversationsAPI extends API {
  // initial backend route endpoint
  public static route = "groupMessage";

  // creates and returns a new group conversation where the inputted user is the host
  public static async createConversation(username: string, group: NewGroup) {
    const res = await this.postRequest(`new/${username}`, group);
    return res;
  }

  // gets all groups that the user is a part of, returns either a simpler or more complex version of
  // the list based on inputted params
  public static async getAllGroups(
    username: string,
    params: any,
  ): Promise<AllGroups | SimpleGroup[]> {
    const res = await this.getRequest(username, params);
    return res.groups;
  }

  // gets an initial list of group names and their hosts
  public static async getAllGroupNames(name: string): Promise<GroupName[]> {
    const res = await this.getRequest("getNames", { name });
    return res.groups;
  }

  // returns information for a single group, gets either a simpler or more complex list of data based
  // on getSimple input
  public static async getGroup(
    id: string,
    getSimple: boolean = false,
  ): Promise<ReturnGroup> {
    const res = await this.getRequest(`id/${id}`, { getSimple });
    return res;
  }

  // returns a list of groups based on inputted search params
  public static async searchGroups(
    params: GroupSearchParams,
  ): Promise<GroupSearchCard[]> {
    const res = await this.getRequest("search", params);
    return res.groups;
  }

  // returns a list of group tabs for the group conversation page
  public static async getGroupTabs(username: string): Promise<GroupTab[]> {
    const res = await this.getRequest(`${username}/tabs`);
    return res.groups;
  }

  // returns a list of group members other than current user and group messages for a
  // group conversation for the group conversation page
  public static async getGroupMessages(
    username: string,
    id: string,
  ): Promise<GroupMessageInfo> {
    const res = await this.getRequest(`${username}/message/${id}`);
    return res;
  }

  // creates and returns a new message in a group conversation for group with inputted id and
  // from the user with the inputted username
  public static async createGroupMessage(
    username: string,
    id: string,
    message: NewConversationMessage,
  ): Promise<ReturnMessage> {
    const res = await this.postRequest(`${username}/message/${id}`, message);
    return res;
  }

  public static async getGroupMemberDeleteInfo(
    username: string,
    id: string,
  ): Promise<any> {
    const res = await this.getRequest(`${username}/delete/${id}/member`);
    return res;
  }

  public static async removeGroupMember(
    username: string,
    id: string,
    removedUser: string,
  ): Promise<any> {
    const res = await this.deleteRequest(`${username}/delete/${id}/member`, {
      removedUser,
    });
    return res;
  }
}

export default groupConversationsAPI;
