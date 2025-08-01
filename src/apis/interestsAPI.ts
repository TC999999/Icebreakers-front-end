import API from "./api";
import { type interests } from "../types/interestTypes";

class interestsAPI extends API {
  public static route: string = "interests";

  public static async getInterests(): Promise<interests> {
    let res = await this.getRequest("initial");
    return res.interests;
  }
}

export default interestsAPI;
