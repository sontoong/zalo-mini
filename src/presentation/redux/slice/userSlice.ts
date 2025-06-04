import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { User } from "../../models/user";
import { getUserID, getDeviceId, nativeStorage } from "zmp-sdk";
import { md5 } from "hash-wasm";

let initUser = {};

export type TAuth = {
  currentUser: User;
  saleManInfo: any;
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TAuth = {
  currentUser: initUser as User,
  saleManInfo: {},
  isFetching: false,
  isSending: false,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<TAuth["currentUser"]>) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
    setSaleManInfo: (state, action: PayloadAction<TAuth["currentUser"]>) => {
      state.saleManInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("user/fetch/") &&
          action.type.endsWith("/pending"),
        (state) => {
          return {
            ...state,
            isFetching: true,
          };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("user/send/") &&
          action.type.endsWith("/pending"),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("user/send/") &&
          action.type.endsWith("/fulfilled"),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("user/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const checkExistAsync = createAsyncThunk<any, CheckExistBody>(
  "user/fetch/checkExist",
  async (body, { rejectWithValue }) => {
    try {
      const zalo_app_uid = await getUserID();
      const zalo_device_id = getDeviceId();
      const session_id = Math.random().toString(36).substring(2, 15);

      const response = await agent.Auth.checkExist({
        ...body,
        zalo_app_uid,
        session_id,
        zalo_device_id,
      });
      return response.result;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data.message);
      }
      throw error;
    }
  },
);

export const loginAsync = createAsyncThunk<any, LoginBody>(
  "user/send/login",
  async (body, { rejectWithValue }) => {
    try {
      const zalo_app_uid = await getUserID();
      const session_id = Math.random().toString(36).substring(2, 15);
      const zalo_device_id = getDeviceId();

      const hash = `${body.name}:${body.phone}:${zalo_app_uid}:${zalo_device_id}2wsxXSW@`;
      const checksum = await md5(hash);

      const response = await agent.Auth.login({
        ...body,
        zalo_device_id,
        zalo_app_uid,
        session_id,
        checksum,
      });
      return response.result;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data.message);
      }
      throw error;
    }
  },
);

export const getAccountInfoAsync = createAsyncThunk<any, GetAccountInfoParams>(
  "user/fetch/getAccountInfo",
  async (params, { rejectWithValue }) => {
    try {
      const response = await agent.User.getAccountInfo(params);
      return response.result;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data.message);
      }
      throw error;
    }
  },
);

export const refreshTokenAsync = createAsyncThunk<any, RefreshTokenBody>(
  "user/fetch/refreshToken",
  async (body, { rejectWithValue }) => {
    try {
      const refresh_token = nativeStorage.getItem("refresh_token");
      const zalo_device_id = getDeviceId();

      const response = await agent.Auth.refreshToken({
        ...body,
        zalo_device_id,
        token: refresh_token,
      });
      return response.result;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data.message);
      }
      throw error;
    }
  },
);

export const { setCurrentUser, setSaleManInfo } = authSlice.actions;

export default authSlice.reducer;

export type CheckExistBody = {
  tenant_id: string;
  customapp_id: string;
  lang_id: string;
};

export type LoginBody = {
  tenant_id: string;
  customapp_id: string;
  phone: string;
  name: string;
  lang_id: string;
};

export type RefreshTokenBody = {
  customapp_id: string;
  lang_id: string;
};

export type GetAccountInfoParams = {
  tenant_id: string;
  lang_id: string;
  customapp_id: string;
};
