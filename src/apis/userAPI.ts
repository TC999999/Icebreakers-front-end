import API from "./api";

class userAPI extends API {
  public static route: string = "user";

  public static async getUserProfile(username: string) {
    let res = await this.getRequest(username);
    return res.user;
  }
}

export default userAPI;
