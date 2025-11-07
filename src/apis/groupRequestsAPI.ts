import requestsAPI from "./requestsAPI";
import type {
  groupConversationResponse,
  groupRequestFormData,
} from "../types/requestTypes";

class groupRequestsAPI extends requestsAPI {
  public static route = requestsAPI.route + "/group";

  public static async sendRequest(
    id: string,
    message: groupRequestFormData
  ): Promise<any> {
    let res = await this.postRequest(id, message);
    return res.request;
  }

  public static async removeRequest(id: string, remove: boolean): Promise<any> {
    let res = await this.patchRequest(`update/${id}`, { remove });
    return res.request;
  }

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
