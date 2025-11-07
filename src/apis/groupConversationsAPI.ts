import API from "./api";
import type {
  newGroup,
  allGroups,
  GroupPage,
  simpleGroup,
  GroupInvitation,
  groupSearchCard,
  groupName,
} from "../types/groupTypes";

type returnGroup = {
  group: GroupPage | groupName;
  isInGroup?: boolean;
  requestPending?: boolean;
};

class groupConversationsAPI extends API {
  public static route = "groupMessage";

  public static async createConversation(group: newGroup) {
    const res = await this.postRequest("new", group);
    return res;
  }

  public static async getAllGroups(
    username: string,
    params: any
  ): Promise<allGroups | simpleGroup[]> {
    const res = await this.getRequest(username, params);
    return res.groups;
  }

  public static async getAllGroupNames(): Promise<groupName[]> {
    const res = await this.getRequest("getNames");
    return res.groups;
  }

  public static async getGroup(
    id: string,
    getSimple: boolean = false
  ): Promise<returnGroup> {
    const res = await this.getRequest(`id/${id}`, { getSimple });
    return res;
  }

  public static async sendInvitation(group: GroupInvitation): Promise<any> {
    const res = await this.postRequest(`invitation/${group.from}`, group);
    return res.invitation;
  }

  public static async searchGroups(params: any): Promise<groupSearchCard[]> {
    const res = await this.getRequest("search", params);
    return res.groups;
  }
}

export default groupConversationsAPI;
