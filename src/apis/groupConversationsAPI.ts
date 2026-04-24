import API from "./api";
import type {
  NewGroup,
  AllGroups,
  GroupPage,
  SimpleGroup,
  GroupSearchCard,
  GroupTab,
  GroupMessageInfo,
  GroupSearchParams,
  BaseGroupSearch,
} from "../types/groupTypes";
import type {
  ConversationMessage,
  NewConversationMessage,
} from "../types/conversationTypes";
import type { GroupMessageUserUpdate } from "../types/userTypes";

type ReturnGroup = {
  group: GroupPage;
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

  // gets two separate lists of all groups (id, title, creation date) that the user
  // is a part of: groups are separated by groups hosted by the user and those that are
  // not
  public static async getAllGroups(username: string): Promise<AllGroups> {
    const res = await this.getRequest(username, {});
    return res.groups;
  }

  // gets a list of all groups (their ids and titles ) that the user is a part of
  public static async getAllGroupsSimple(
    username: string,
  ): Promise<SimpleGroup[]> {
    const res = await this.getRequest(username, { getSingle: true });
    return res.groups;
  }

  // gets an initial list of group names and their hosts
  public static async getAllGroupNames(
    name: string,
  ): Promise<BaseGroupSearch[]> {
    const res = await this.getRequest("getNames", { name });
    return res.groups;
  }

  // returns information for a single group, including what the current user's
  // relationship with the group is (if they are a member of the group or have
  // a pending request/invitation)
  public static async getGroup(id: string): Promise<ReturnGroup> {
    const res = await this.getRequest(`id/${id}`, { getSimple: false });
    return res;
  }

  // returns the title and host of a single group
  public static async getGroupSimple(id: string): Promise<BaseGroupSearch> {
    const res = await this.getRequest(`id/${id}`, { getSimple: true });
    return res.group;
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
