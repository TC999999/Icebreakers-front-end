import API from "./api";

class requestsAPI extends API {
  public static route = "requests";

  public static async getRequests(username: string, params: any): Promise<any> {
    let res = await this.getRequest(username, params);
    return res.requests;
  }

  public static async getRequestCount(username: string): Promise<any> {
    let res = await this.getRequest(`count/${username}`);
    return res;
  }
}

export default requestsAPI;
