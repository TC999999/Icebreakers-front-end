import request from "./basicRequest";

class API {
  public static route: string;

  public static getRoute() {
    console.log(this.route);
  }

  public static async getRequest(
    endpoint: string = "",
    data = {}
  ): Promise<any> {
    let res = await request(this.route, endpoint, "get", data);
    return res;
  }

  public static async postRequest(
    endpoint: string = "",
    data = {}
  ): Promise<any> {
    let res = await request(this.route, endpoint, "post", data);
    return res;
  }

  public static async patchRequest(
    endpoint: string = "",
    data = {}
  ): Promise<any> {
    let res = await request(this.route, endpoint, "patch", data);
    return res;
  }

  public static async deleteRequest(
    endpoint: string = "",
    data = {}
  ): Promise<any> {
    let res = await request(this.route, endpoint, "delete", data);
    return res;
  }
}

export default API;
