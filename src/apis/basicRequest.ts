import axios, { type AxiosResponse } from "axios";
import { API_URL } from "../config";

type method = "get" | "post" | "patch" | "delete";

async function request(
  route: string,
  endpoint: string,
  method: method,
  data = {}
): Promise<any> {
  const url = `${API_URL}/${route}/${endpoint}`;
  try {
    let res: AxiosResponse = await axios({
      method: method,
      url,
      data,
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(JSON.stringify(err.response.data.error));
  }
}

export default request;
