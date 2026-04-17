import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Register, LogIn, UserState } from "../../types/authTypes";
import axiosInstance from "../../apis/axiosInstance";
import socket from "../../helpers/socket";

// redux thunk function to create a new account and return data to set in redux state
export const RegisterUser = createAsyncThunk<UserState, Register>(
  "auth/register",
  async (
    userInfo: Register = {
      username: "",
      password: "",
      emailAddress: "",
      favoriteColor: "",
      biography: "",
      interests: [],
    },
    thunkAPI,
  ) => {
    try {
      let res = await axiosInstance({
        method: "post",
        url: `auth/register`,
        data: userInfo,
      });

      socket.connect();

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  },
);

// redux thunk function to retrieve user data to set in redux state
export const LogInUser = createAsyncThunk<UserState, LogIn>(
  "auth/login",
  async (userInfo: LogIn = { username: "", password: "" }, thunkAPI) => {
    try {
      let res = await axiosInstance({
        method: "post",
        url: `auth/login`,
        data: userInfo,
      });

      socket.connect();

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  },
);

// redux thunk function to check backend if user session exists and add to redux state if it does
export const getCurrentUser = createAsyncThunk<UserState, any>(
  "auth/currentUser",
  async (data = {}, thunkAPI) => {
    try {
      let res = await axiosInstance({
        method: "get",
        url: `auth/currentUser`,
        data: data,
      });

      if (res.data.user) socket.connect();

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  },
);

// redux thunk function to remove user session from backend, disconnect socket, and return data to
// remove from user redux state
export const LogOutUser = createAsyncThunk<UserState, any>(
  "auth/logout",
  async (data = {}, thunkAPI) => {
    try {
      let res = await axiosInstance({
        method: "get",
        url: `/auth/logout`,
        data: data,
      });

      socket.disconnect();

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  },
);
