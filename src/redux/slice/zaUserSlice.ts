import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { ZAUser } from "../../models/za_user";
import { getLocation, getPhoneNumber } from "zmp-sdk/apis";

let initUser = {};

export type TAuth = {
  currentUser: ZAUser;
  phoneNumber: string;
  location: {
    provider: string;
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  settings: { [key: string]: boolean };
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TAuth = {
  currentUser: initUser as ZAUser,
  location: {} as TAuth["location"],
  settings: {},
  phoneNumber: "",
  isFetching: false,
  isSending: false,
};

const zaUserSlice = createSlice({
  name: "zauser",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<TAuth["currentUser"]>) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
    setPhoneNumber: (state, action: PayloadAction<TAuth["phoneNumber"]>) => {
      state.phoneNumber = action.payload;
    },
    setLocation: (state, action: PayloadAction<TAuth["location"]>) => {
      state.location = action.payload;
    },
    setSettings: (state, action: PayloadAction<TAuth["settings"]>) => {
      state.settings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("zauser/fetch/") &&
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
          action.type.startsWith("zauser/send/") &&
          action.type.endsWith("/pending"),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("zauser/send/") &&
          action.type.endsWith("/fulfilled"),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("zauser/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const authorize = createAsyncThunk<any, void>(
  "zauser/send/authorize",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Zalo.authorize({
        scopes: ["scope.userLocation", "scope.userPhonenumber"],
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const getAccountInfo = createAsyncThunk<any, void>(
  "zauser/fetch/getAccountInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Zalo.getAccountInfo({
        autoRequestPermission: true,
      });
      return response.userInfo;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const openPS = createAsyncThunk<any, void>(
  "zauser/fetch/openPS",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Zalo.openPS();
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const followOA = createAsyncThunk<any, void>(
  "zauser/fetch/followOA",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Zalo.followOA({
        id: "3524905692310899909",
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const getPhoneNumberRequest = createAsyncThunk<any, void>(
  "zauser/fetch/getPhoneNumberRequest",
  async (_, { rejectWithValue }) => {
    try {
      const { token } = await getPhoneNumber();
      const response = await agent.Zalo.getPhoneNumberRequest({
        code: token,
      });
      return response.data.number;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const getLocationRequest = createAsyncThunk<any, void>(
  "zauser/fetch/getLocationRequest",
  async (_, { rejectWithValue }) => {
    try {
      const { token } = await getLocation();
      const response = await agent.Zalo.getLocationRequest({ code: token });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const getSettings = createAsyncThunk<any, void>(
  "zauser/fetch/getSetting",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Zalo.getSetting();
      return response.authSetting;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const { setCurrentUser, setLocation, setPhoneNumber, setSettings } =
  zaUserSlice.actions;

export default zaUserSlice.reducer;
