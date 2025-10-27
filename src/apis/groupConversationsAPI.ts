import API from "./api";
import type { newGroup, allGroups, GroupPage } from "../types/groupTypes";

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

  public static async getAllGroups(username: string): Promise<allGroups> {
    const res = await this.getRequest(username);
    return res.groups;
  }

  public static async getGroup(id: string): Promise<returnGroup> {
    const res = await this.getRequest(`id/${id}`);
    return res;
  }
}

export default groupConversationsAPI;
