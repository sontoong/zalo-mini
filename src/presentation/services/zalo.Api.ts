import axios, { AxiosError, AxiosResponse } from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { Envs } from "../utils/env";
import { baseRequests } from "./baseApi";
import { getAccessToken } from "zmp-sdk/apis";

NProgress.configure({ showSpinner: false });

const baseURL = Envs.api_zalo;
const secretKey = Envs.za_key;
const timeout = 60 * 1000;

const responseBody = (response: AxiosResponse) => response.data;

const zaloApi = axios.create({
  baseURL,
  timeout: timeout,
});

zaloApi.interceptors.request.use(async (config) => {
  const accessTokenZalo =
    (await getAccessToken({})) || import.meta.env.VITE_ZALO_APP_TOKEN;

  if (accessTokenZalo) {
    config.headers["access_token"] = accessTokenZalo;
    config.headers["secret_key"] = secretKey;
  }
  NProgress.start();
  return config;
});

zaloApi.interceptors.response.use(
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
    return Promise.reject(error);
  },
);

const zaloRequests = {
  get: <T>(url: string, params?: T) =>
    zaloApi.get(url, { params }).then(responseBody),
  post: <T>(url: string, body: T) => zaloApi.post(url, body).then(responseBody),
  put: <T>(url: string, body: T) => zaloApi.put(url, body).then(responseBody),
  patch: <T>(url: string, body: T) =>
    zaloApi.patch(url, body).then(responseBody),
  del: <T>(url: string, params?: T) =>
    zaloApi.delete(url, { params }).then(responseBody),
};

const baseZaloRequests = baseRequests(baseURL);

export { zaloRequests, baseZaloRequests };
