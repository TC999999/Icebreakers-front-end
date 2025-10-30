import requestsAPI from "./requestsAPI";
import type {
  directConversationRequest,
  directConversationResponse,
} from "../types/requestTypes";

class directRequestsAPI extends requestsAPI {
  public static route = requestsAPI.route + "/direct";

  public static async makeDirectConversationRequest(
    request: directConversationRequest
  ): Promise<any> {
    let res = await this.postRequest("", request);
    return res;
  }

  public static async removeDirectConversationRequest(
    id: string,
    remove: boolean
  ): Promise<any> {
    let res = await this.patchRequest(`update/${id}`, { remove });
    return res.request;
  }

  public static async respondToDirectConversationRequest(
    response: directConversationResponse
  ): Promise<any> {
    let res = await this.postRequest("response", response);
    return res;
  }
}

export default directRequestsAPI;
