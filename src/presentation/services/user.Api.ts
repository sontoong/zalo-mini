import axios, { AxiosError, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { nativeStorage, getUserID } from "zmp-sdk";
import { getAccessToken } from "zmp-sdk/apis";

import agent from "./agent";
import { Envs } from "../utils/env";
import { baseRequests } from "./baseApi";

NProgress.configure({ showSpinner: false });

const baseURL = Envs.api_user;
const timeout = 60 * 1000;

const responseBody = (response: AxiosResponse) => response.data;

const userApi = axios.create({
  baseURL,
  timeout: timeout,
});

let refreshTokenPromise: Promise<any> | null = null;

userApi.interceptors.request.use(async (config) => {
  const accessToken = nativeStorage.getItem("access_token");
  const refreshToken = nativeStorage.getItem("refresh_token");

  const accessTokenZalo =
    (await getAccessToken({})) || import.meta.env.VITE_ZALO_APP_TOKEN;
  const zaloUid = (await getUserID()) || import.meta.env.VITE_ZALO_APP_UID;

  if (accessToken) {
    const decodeToken = jwtDecode(accessToken) as { exp: number };
    const currentTime = Date.now() / 1000;

    if (decodeToken.exp < currentTime) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = agent.Auth.refreshToken({
          refreshToken: refreshToken,
        })
          .then((data) => {
            nativeStorage.setItem("access_token", data.result.access_token);
            nativeStorage.setItem("refresh_token", data.result.refresh_token);
            refreshTokenPromise = null;
            return data.result;
          })
          .catch((error) => {
            refreshTokenPromise = null;
            if (error instanceof AxiosError) {
              if (error.response?.status === 400) {
                throw error;
              }
            }
            nativeStorage.clear();
          });
      }

      const data = await refreshTokenPromise;
      config.headers["Authorization"] = `Bearer ${data.access_token}`;
      config.headers["zuToken"] = accessTokenZalo;
      config.headers["zuId"] = zaloUid;
    } else {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      config.headers["zuToken"] = accessTokenZalo;
      config.headers["zuId"] = zaloUid;
    }
  }
  NProgress.start();
  return config;
});

userApi.interceptors.response.use(
  async (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    if (["ECONNABORTED"].includes(error.code)) {
      const reformatError = new AxiosError(
        "Connection Timeout.", // New error message
        error.code,
        error.config,
        error.request,
        error.response,
      );
      reformatError.stack = error.stack; // Preserve stack trace

      return Promise.reject(reformatError);
    }
    if (error.response && [401].includes(error.response.status)) {
      nativeStorage.clear();
    }
    if (
      error.response &&
      error.response.data.errors &&
      [400].includes(error.response.status)
    ) {
      const reformatError = new AxiosError(
        Object.entries(error.response.data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`,
          )
          .join("; "),
        error.code,
        error.config,
        error.request,
      );
      reformatError.stack = error.stack;

      return Promise.reject(reformatError);
    }
    return Promise.reject(error);
  },
);

const userRequests = {
  get: <T>(url: string, params?: T) =>
    userApi.get(url, { params }).then(responseBody),
  post: <T>(url: string, body: T) => userApi.post(url, body).then(responseBody),
  put: <T>(url: string, body: T) => userApi.put(url, body).then(responseBody),
  patch: <T>(url: string, body: T) =>
    userApi.patch(url, body).then(responseBody),
  del: <T>(url: string, params?: T) =>
    userApi.delete(url, { params }).then(responseBody),
};

const baseUserRequests = baseRequests(baseURL);

export { userRequests, baseUserRequests };
