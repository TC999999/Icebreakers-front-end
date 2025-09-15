import API from "./api";
import { type UserProfile, type UserCard } from "../types/userTypes";

class userAPI extends API {
  public static route: string = "user";

  public static async userCheck(username: string): Promise<string | null> {
    let res = await this.getRequest(`check/${username}`);
    if (res.user) {
      return res.user.username;
    } else {
      return null;
    }
  }

  public static async getUserProfile(username: string): Promise<UserProfile> {
    let res = await this.getRequest(username);
    return res.user;
  }

  public static async getUserNames(): Promise<string[]> {
    let res = await this.getRequest("search/get");
    return res.users;
  }

  public static async searchForUsers(params: any): Promise<UserCard[]> {
    let res = await this.getRequest("search/all", params);
    return res.users;
  }
}

export default userAPI;
