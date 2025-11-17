import request from "./basicRequest";

// class containing basic API CRUD request functions. This class extends to all other API classes.
class API {
  // beginning route endpoint string: different for every API class.
  public static route: string;

  // basic get request function; data is passed along as a query to the backend
  public static async getRequest(
    endpoint: string = "",
    data = {}
  ): Promise<any> {
    let res = await request(this.route, endpoint, "get", data);
    return res;
  }

  // basic post request function; data is passed along in the body of the request to the backend
  public static async postRequest(
    endpoint: string = "",
    data = {}
  ): Promise<any> {
    let res = await request(this.route, endpoint, "post", data);
    return res;
  }

  // basic patch request function; data is passed along in the body of the request to the backend
  public static async patchRequest(
    endpoint: string = "",
    data = {}
  ): Promise<any> {
    let res = await request(this.route, endpoint, "patch", data);
    return res;
  }

  // basic delete request function; data is passed along in the body of the request to the backend
  public static async deleteRequest(
    endpoint: string = "",
    data = {}
  ): Promise<any> {
    let res = await request(this.route, endpoint, "delete", data);
    return res;
  }
}

export default API;
