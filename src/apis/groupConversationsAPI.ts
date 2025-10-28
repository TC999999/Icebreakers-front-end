import API from "./api";
import type {
  newGroup,
  allGroups,
  GroupPage,
  simpleGroup,
  GroupInvitation,
} from "../types/groupTypes";

type returnGroup = {
  group: GroupPage;
  isInGroup: boolean;
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

  public static async getGroup(id: string): Promise<returnGroup> {
    const res = await this.getRequest(`id/${id}`);
    return res;
  }

  public static async sendInvitation(group: GroupInvitation): Promise<any> {
    const res = await this.postRequest(`invitation/${group.from}`, group);
    return res.invitation;
  }
}

export default groupConversationsAPI;
