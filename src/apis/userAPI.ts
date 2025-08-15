import API from "./api";
import { type UserProfile } from "../types/userTypes";

class userAPI extends API {
  public static route: string = "user";

  public static async getUserProfile(username: string): Promise<UserProfile> {
    let res = await this.getRequest(username);
    return res.user;
  }
}

export default userAPI;
