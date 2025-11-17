import API from "./api";
import type { interestMap, interests } from "../types/interestTypes";

// API for interests, including getting a list on interests as either a map or an array
// extends from the requests API class
class interestsAPI extends API {
  // initial endpoint for backend direct request route
  public static route: string = "interests";

  // returns a list of interests as an array
  public static async getInterests(): Promise<interests> {
    let res = await this.getRequest("initial");
    return res.interests;
  }

  // returns a list of interests as a map
  public static async getInterestsMap(): Promise<interestMap> {
    let res = await this.getRequest("map");
    return res.interests;
  }
}

export default interestsAPI;
