import API from "./api";

// API for basic request actions
// extends from the requests API class
class requestsAPI extends API {
  // initial endpoint for backend direct request route
  public static route = "requests";

  // gets all requests for a single user based on search params
  // (for example:
  // {directOrGroup:"direct", requestOrInvitation:"request", type:"received"}
  // returns all direct conversation request the user received that have not been removed)
  public static async getRequests(username: string, params: any): Promise<any> {
    let res = await this.getRequest(username, params);
    return res.requests;
  }

  // returns a map of the count of requests currently in request inbox
  public static async getRequestCount(username: string): Promise<any> {
    let res = await this.getRequest(`count/${username}`);
    return res;
  }
}

export default requestsAPI;
