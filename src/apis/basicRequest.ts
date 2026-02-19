import { type AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

export type method = "get" | "post" | "patch" | "delete";

// universal function for making axios CRUD requests: used only for requests that don't
// require changes to redux state (not used for registration, login, or logout)
async function request(
  route: string,
  endpoint: string = "",
  method: method,
  data = {},
): Promise<any> {
  const url = `${route}/${endpoint}`;

  const params = method === "get" ? data : {};

  try {
    let res: AxiosResponse = await axiosInstance({
      method,
      url,
      data,
      params,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(JSON.stringify(err.response.data.error));
  }
}

export default request;
