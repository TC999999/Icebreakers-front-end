import request from "./basicRequest";

class API {
  public static route: string;

  public static getRoute() {
    console.log(this.route);
  }

  public static async getRequest(endpoint: string): Promise<any> {
    let res = await request(this.route, endpoint, "get");
    return res;
  }

  public static async postRequest(endpoint: string): Promise<any> {
    let res = await request(this.route, endpoint, "post");
    return res;
  }

  public static async patchRequest(endpoint: string): Promise<any> {
    let res = await request(this.route, endpoint, "patch");
    return res;
  }

  public static async deleteRequest(endpoint: string): Promise<any> {
    let res = await request(this.route, endpoint, "delete");
    return res;
  }
}

export default API;
