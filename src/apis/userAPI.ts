import API from "./api";
import type { UserProfile, UserCard, UserEdit } from "../types/userTypes";
import type { interestMap } from "../types/interestTypes";

type EditReturn = {
  user: UserEdit;
  interests: interestMap;
};

// API for user information; extends basic
// extends from the requests API class
class userAPI extends API {
  // initial endpoint for backend direct request route
  public static route: string = "user";

  // returns whether or not user exists
  public static async userCheck(username: string): Promise<any> {
    let res = await this.getRequest(`check/${username}`);
    return res;
  }

  // returns user profile information based on inputted username
  public static async getUserProfile(username: string): Promise<UserProfile> {
    let res = await this.getRequest(username);
    return res.user;
  }

  // returns a list of initial usernames to use for search bar dropdowns
  public static async getUserNames(): Promise<string[]> {
    let res = await this.getRequest("search/get");
    return res.users;
  }

  // returns a list of users based on inputted search params
  public static async searchForUsers(params: any): Promise<UserCard[]> {
    let res = await this.getRequest("search/all", params);
    return res.users;
  }

  // returns user information to be updated based on inputted username
  public static async getUserForEdit(username: string): Promise<EditReturn> {
    let res = await this.getRequest(`${username}/edit`);
    return res;
  }

  // updates user information and returns that information to the user
  public static async editUser(username: string, user: UserEdit): Promise<any> {
    let res = await this.patchRequest(`${username}/edit`, user);
    return res;
  }
}

export default userAPI;
