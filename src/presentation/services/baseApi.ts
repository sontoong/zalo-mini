import axios, { AxiosError, AxiosResponse } from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getUserID } from "zmp-sdk";
import { getAccessToken } from "zmp-sdk/apis";

NProgress.configure({ showSpinner: false, parent: "#main-content" });

const timeout = 60 * 1000;

const responseBody = (response: AxiosResponse) => response.data;

const baseRequests = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: timeout,
    // signal: AbortSignal.timeout(timeout),
    // withCredentials: true,
  });

  instance.interceptors.request.use(async (config) => {
    const accessTokenZalo =
      (await getAccessToken({})) || import.meta.env.VITE_ZALO_APP_TOKEN;
    const zaloUid = (await getUserID()) || import.meta.env.VITE_ZALO_APP_UID;

    config.headers["zuToken"] = accessTokenZalo;
    config.headers["zuId"] = zaloUid;

    NProgress.start();
    return config;
  });

  instance.interceptors.response.use(
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

  const requests = {
    get: <T>(url: string, params?: T) =>
      instance.get(url, { params }).then(responseBody),
    post: <T>(url: string, body: T) =>
      instance.post(url, body).then(responseBody),
    put: <T>(url: string, body: T) =>
      instance.put(url, body).then(responseBody),
    patch: <T>(url: string, body: T) =>
      instance.patch(url, body).then(responseBody),
    del: <T>(url: string, params?: T) =>
      instance.delete(url, { params }).then(responseBody),
  };

  return requests;
};

export { baseRequests };
