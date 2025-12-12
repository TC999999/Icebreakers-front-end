import API from "./api";
import type { blockedUser } from "../types/userTypes";

// API class for blocking other users; includes functions to block another user,
// retrieve a list of all users blocked by a single user, and unblock a blocked user
class blockAPI extends API {
  // initial backend route endpoint
  public static route = "block";

  // creates and returns new data for a single user to bloc another user on the server side
  public static async blockUser(
    username: string,
    blockedUser: string
  ): Promise<any> {
    const res = await this.postRequest(`users/${username}/new`, {
      blockedUser,
    });
    return res.blockedData;
  }

  // retrieves a list of users blocked by a single user from the server side
  public static async getBlockedUsers(
    username: string
  ): Promise<blockedUser[]> {
    const res = await this.getRequest(`users/${username}`);
    return res.blockedUsers;
  }

  // creates and returns new data for a single user to unblock a blocked user on the server
  // side
  public static async unblockUser(
    username: string,
    blockedUser: string
  ): Promise<any> {
    const res = await this.deleteRequest(`users/${username}`, { blockedUser });
    return res;
  }
}

export default blockAPI;
