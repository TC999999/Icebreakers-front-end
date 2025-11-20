import requestsAPI from "./requestsAPI";
import type {
  groupConversationResponse,
  groupRequestFormData,
} from "../types/requestTypes";
import type { GroupInvitation } from "../types/groupTypes";

// API for group conversation requests, including creating requests for other users, removing
// requests users have send, and responing to requests users have received
// extends from the requests API class
class groupRequestsAPI extends requestsAPI {
  // initial endpoint for backend direct request route: togther its "requests/group"
  public static route = requestsAPI.route + "/group";

  // creates and returns a new request made by current user to join an existing group
  public static async sendRequest(
    id: string,
    message: groupRequestFormData
  ): Promise<any> {
    let res = await this.postRequest(`${id}/new/${message.from}`, message);
    return res.request;
  }

  // updates and returns an existing group request made by current user to join an existing group
  // to be marked as removed an be unseeable by the host of the group
  public static async removeRequest(
    id: string,
    username: string,
    remove: boolean
  ): Promise<any> {
    let res = await this.patchRequest(`update/${id}/${username}`, { remove });
    return res.request;
  }

  // deletes and returns a request received by the current host user and adds the sender user
  // to the group they requested to join
  public static async respondToGroupRequest(
    username: string,
    response: groupConversationResponse
  ) {
    let res = await this.postRequest(
      `response/${response.id}/${username}`,
      response
    );
    return res;
  }

  // creates and returns new group invitation for another user to join a group you are in
  public static async sendGroupInvitation(
    username: string,
    group: GroupInvitation
  ): Promise<any> {
    const res = await this.postRequest(
      `${group.group}/invitation/new/${username}`,
      group
    );
    return res.invitation;
  }

  // updates and returns an existing group invitation made by current user to invite another user
  // into an existing group they are a part of to be marked as removed an be unseeable by the
  // recipient
  public static async removeGroupConversationInvitation(
    id: string,
    username: string,
    remove: boolean
  ): Promise<any> {
    let res = await this.patchRequest(`invitation/update/${id}/${username}`, {
      remove,
    });
    return res.invitation;
  }

  // deletes and returns an inviation received by the current user and adds the user
  // to the group they were invited to join
  public static async respondToGroupInvitation(
    username: string,
    response: groupConversationResponse
  ) {
    let res = await this.postRequest(
      `invitation/response/${response.id}/${username}`,
      response
    );
    return res;
  }
}

export default groupRequestsAPI;
