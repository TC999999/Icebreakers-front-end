import API from "./api";
import type { requestInfiniteQueryRes } from "../types/requestTypes";

// API for basic request actions
// extends from the requests API class
class requestsAPI extends API {
  // initial endpoint for backend direct request route
  public static route = "requests";

  // gets all requests for a single user based on search params
  // (for example:
  // {directOrGroup:"direct", requestOrInvitation:"requests", type:"received", limit:1, offset:0}
  // returns the first direct conversation request the user received that has not been removed)
  public static async getRequests(
    username: string,
    params: any,
  ): Promise<requestInfiniteQueryRes> {
    const res = await this.getRequest(username, params);
    return res;
  }

  // returns a map of the count of requests currently in request inbox
  public static async getRequestCount(username: string): Promise<any> {
    let res = await this.getRequest(`count/${username}`);
    return res;
  }
}

export default requestsAPI;
