import requestsAPI from "./requestsAPI";
import type {
  directConversationRequest,
  directConversationResponse,
} from "../types/requestTypes";

// API for direct conversation requests, including creating requests for other users, removing
// requests users have send, and responing to requests users have received
// extends from the requests API class
class directRequestsAPI extends requestsAPI {
  // initial endpoint for backend direct request route: togther its "requests/direct"
  public static route = requestsAPI.route + "/direct";

  // creates and returns a new direct conversation request
  public static async makeDirectConversationRequest(
    request: directConversationRequest
  ): Promise<any> {
    let res = await this.postRequest(`new/${request.from}`, request);
    return res;
  }

  // updates and returns an existing direct conversation request so the other user no longer sees it
  public static async removeDirectConversationRequest(
    id: string,
    username: string,
    remove: boolean
  ): Promise<any> {
    let res = await this.patchRequest(`update/${id}/${username}`, { remove });
    return res.request;
  }

  // deletes an existing direct conversation request and creates and returns a new conversation
  // if receiving user accepts request
  public static async respondToDirectConversationRequest(
    response: directConversationResponse
  ): Promise<any> {
    let res = await this.postRequest(
      `response/${response.id}/${response.to}`,
      response
    );
    return res;
  }
}

export default directRequestsAPI;
