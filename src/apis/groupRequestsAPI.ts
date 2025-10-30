import requestsAPI from "./requestsAPI";

class groupRequestsAPI extends requestsAPI {
  public static route = requestsAPI.route + "/group";

  public static async removeGroupConversationInvitation(
    id: string,
    remove: boolean
  ): Promise<any> {
    let res = await this.patchRequest(`invitation/update/${id}`, { remove });
    return res.invitation;
  }
}

export default groupRequestsAPI;
