import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../config";
import {
  type Register,
  type LogIn,
  type UserState,
} from "../../types/authTypes";
import axios from "axios";
import socket, { setUpSocket } from "../../helpers/socket";

export const RegisterUser = createAsyncThunk<UserState, Register>(
  "auth/login",
  async (
    userInfo: Register = {
      username: "",
      password: "",
      emailAddress: "",
      favoriteColor: "",
      biography: "",
      interests: [],
    },
    thunkAPI
  ) => {
    try {
      let res = await axios({
        method: "post",
        url: `${API_URL}/auth/register`,
        data: userInfo,
        withCredentials: true,
      });

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);

export const LogInUser = createAsyncThunk<UserState, LogIn>(
  "auth/login",
  async (userInfo: LogIn = { username: "", password: "" }, thunkAPI) => {
    try {
      let res = await axios({
        method: "post",
        url: `${API_URL}/auth/login`,
        data: userInfo,
        withCredentials: true,
      });

      setUpSocket(socket);

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk<UserState, any>(
  "auth/currentUser",
  async (data = {}, thunkAPI) => {
    try {
      let res = await axios({
        method: "get",
        url: `${API_URL}/auth/currentUser`,
        data: data,
        withCredentials: true,
      });

      if (res.data.user) {
        setUpSocket(socket);
      }

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);

export const LogOutUser = createAsyncThunk<UserState, any>(
  "auth/logout",
  async (data = {}, thunkAPI) => {
    try {
      let res = await axios({
        method: "get",
        url: `${API_URL}/auth/logout`,
        data: data,
        withCredentials: true,
      });

      socket.disconnect();

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);
