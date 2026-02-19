import request, { type method } from "./basicRequest";

// class containing basic API CRUD request functions. This class extends to all other API classes.
class API {
  // beginning route endpoint string: different for every API class.
  public static route: string;

  public static async basicRequest(
    endpoint: string = "",
    data = {},
    method: method,
  ): Promise<any> {
    let res = await request(this.route, endpoint, method, data);
    return res;
  }

  // basic get request function; data is passed along as a query to the backend
  public static async getRequest(
    endpoint: string = "",
    data = {},
  ): Promise<any> {
    return await this.basicRequest(endpoint, data, "get");
  }

  // basic post request function; data is passed along in the body of the request to the backend
  public static async postRequest(
    endpoint: string = "",
    data = {},
  ): Promise<any> {
    return await this.basicRequest(endpoint, data, "post");
  }

  // basic patch request function; data is passed along in the body of the request to the backend
  public static async patchRequest(
    endpoint: string = "",
    data = {},
  ): Promise<any> {
    return await this.basicRequest(endpoint, data, "patch");
  }

  // basic delete request function; data is passed along in the body of the request to the backend
  public static async deleteRequest(
    endpoint: string = "",
    data = {},
  ): Promise<any> {
    return await this.basicRequest(endpoint, data, "delete");
  }
}

export default API;
