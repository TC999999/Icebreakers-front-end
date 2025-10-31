import requestsAPI from "./requestsAPI";
import type { groupConversationResponse } from "../types/requestTypes";

class groupRequestsAPI extends requestsAPI {
  public static route = requestsAPI.route + "/group";

  public static async removeGroupConversationInvitation(
    id: string,
    remove: boolean
  ): Promise<any> {
    let res = await this.patchRequest(`invitation/update/${id}`, { remove });
    return res.invitation;
  }

  public static async respondToGroupInvitation(
    response: groupConversationResponse
  ) {
    let res = await this.postRequest(`invitation/new/response`, response);
    return res;
  }
}

export default groupRequestsAPI;
