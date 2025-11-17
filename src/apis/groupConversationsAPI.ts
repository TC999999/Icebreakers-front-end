import API from "./api";
import type {
  newGroup,
  allGroups,
  GroupPage,
  simpleGroup,
  groupSearchCard,
  groupName,
} from "../types/groupTypes";

type returnGroup = {
  group: GroupPage | groupName;
  isInGroup?: boolean;
  requestPending?: boolean;
};

// API class for group conversations, including getting all current groups a user is a part of,
// getting all groups that match search params, and getting information for a single group
// extends from the basic API class
class groupConversationsAPI extends API {
  // initial backend route endpoint
  public static route = "groupMessage";

  // creates and returns a new group conversation where the inputted user is the host
  public static async createConversation(username: string, group: newGroup) {
    const res = await this.postRequest("new", { ...group, host: username });
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
}

export default groupConversationsAPI;
