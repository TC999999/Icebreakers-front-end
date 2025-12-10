import API from "./api";

class blockAPI extends API {
  public static route = "block";

  public static async blockUser(
    username: string,
    blockedUser: string
  ): Promise<any> {
    const res = await this.postRequest(`users/${username}/new`, {
      blockedUser,
    });
    return res.blockedData;
  }
}

export default blockAPI;
