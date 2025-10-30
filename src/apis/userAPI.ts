import API from "./api";
import type { UserProfile, UserCard, UserEdit } from "../types/userTypes";
import type { interestMap } from "../types/interestTypes";

type EditReturn = {
  user: UserEdit;
  interests: interestMap;
};

class userAPI extends API {
  public static route: string = "user";

  public static async userCheck(username: string): Promise<any> {
    let res = await this.getRequest(`check/${username}`);
    return res;
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

  public static async getUserForEdit(username: string): Promise<EditReturn> {
    let res = await this.getRequest(`${username}/edit`);
    return res;
  }

  public static async editUser(user: UserEdit): Promise<any> {
    let res = await this.patchRequest(`${user.username}/edit`, user);
    return res;
  }
}

export default userAPI;
