import API from "./api";
import type { newGroup, allGroups } from "../types/groupTypes";

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
}

export default groupConversationsAPI;
