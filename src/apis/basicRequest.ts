import axios, { type AxiosResponse } from "axios";
import { API_URL } from "../config";

export type method = "get" | "post" | "patch" | "delete";

// used for requests that don't require changes to redux state
async function request(
  route: string,
  endpoint: string,
  method: method,
  data = {}
): Promise<any> {
  const url = `${API_URL}/${route}/${endpoint}`;

  const params = method === "get" ? data : {};

  try {
    let res: AxiosResponse = await axios({
      method: method,
      url,
      data,
      params,
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(JSON.stringify(err.response.data.error));
  }
}

export default request;
