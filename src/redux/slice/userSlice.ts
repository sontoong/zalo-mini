import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { User } from "../../models/user";

let initUser = {};

export type TAuth = {
  currentUser: User;
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TAuth = {
  currentUser: initUser as User,
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

export const login = createAsyncThunk<any, LoginBody>(
  "user/send/login",
  async (body, { rejectWithValue }) => {
    try {
      const response = await agent.Auth.login(body);
      return response;
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

export const getAccountInfo = createAsyncThunk<any, void>(
  "user/fetch/getAccountInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.User.getAccountInfo();
      return response.userInfo;
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

export const { setCurrentUser } = authSlice.actions;

export default authSlice.reducer;

export type LoginBody = {
  username: string;
  password: string;
};
