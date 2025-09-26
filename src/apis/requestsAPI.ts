import API from "./api";
import {
  type directConversationRequest,
  type requestsList,
} from "../types/requestTypes";

class requestsAPI extends API {
  public static route = "directMessage";

  public static async makeDirectConversationRequest(
    request: directConversationRequest
  ): Promise<any> {
    let res = await this.postRequest("request", request);
    return res.request;
  }

  public static async getDirectConversationRequests(
    username: string
  ): Promise<requestsList> {
    let res = await this.getRequest(`request/${username}`);
    return res.requests;
  }
}

export default requestsAPI;
