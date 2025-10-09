import API from "./api";
import type {
  directConversationRequest,
  requestsList,
  directConversationResponse,
} from "../types/requestTypes";

class requestsAPI extends API {
  public static route = "directMessage";

  public static async makeDirectConversationRequest(
    request: directConversationRequest
  ): Promise<any> {
    let res = await this.postRequest("request", request);
    return res;
  }

  public static async getDirectConversationRequests(
    username: string
  ): Promise<requestsList> {
    let res = await this.getRequest(`request/${username}`);
    return res.requests;
  }

  public static async removeDirectConversationRequest(
    id: number
  ): Promise<any> {
    let res = await this.patchRequest(`request/remove/${id}`);
    return res;
  }

  public static async resendDirectConversationRequest(
    id: number
  ): Promise<any> {
    let res = await this.patchRequest(`request/resend/${id}`);
    return res;
  }

  public static async respondToDirectConversationRequest(
    response: directConversationResponse
  ): Promise<any> {
    let res = await this.postRequest("response", response);
    return res;
  }
}

export default requestsAPI;
