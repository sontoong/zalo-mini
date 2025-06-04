import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  checkExistAsync,
  getAccountInfoAsync,
  loginAsync,
  LoginBody,
  setCurrentUser,
  GetAccountInfoParams,
  CheckExistBody,
  refreshTokenAsync,
  RefreshTokenBody,
  setSaleManInfo,
} from "../redux/slice/userSlice";
import { useSnackbar } from "zmp-ui";
import { jwtDecode } from "jwt-decode";
import { nativeStorage } from "zmp-sdk/apis";

export function useUser() {
  const { openSnackbar } = useSnackbar();
  const state = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleLogin = useCallback(
    async ({
      body,
      callBackFn,
    }: {
      body: LoginBody;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(loginAsync(body));
      if (loginAsync.fulfilled.match(resultAction)) {
        const { accessToken, refreshToken } = resultAction.payload;
        if (accessToken && refreshToken) {
          const decode = jwtDecode(accessToken) as any;
          {
            nativeStorage.setItem("access_token", accessToken);
            nativeStorage.setItem("refresh_token", refreshToken);
            dispatch(setCurrentUser(decode));
          }
        }
        callBackFn?.();
      } else {
        if (resultAction.payload) {
          openSnackbar({
            text: `${resultAction.payload}`,
            type: "error",
          });
        } else {
          openSnackbar({
            text: resultAction.error.message,
            type: "error",
          });
        }
      }
    },
    [dispatch],
  );

  const handleGetAccountInfo = useCallback(
    async ({
      callBackFn,
      params,
    }: {
      callBackFn?: () => void;
      params: GetAccountInfoParams;
    }) => {
      const resultAction = await dispatch(getAccountInfoAsync(params));
      if (getAccountInfoAsync.fulfilled.match(resultAction)) {
        dispatch(setSaleManInfo(resultAction.payload));
        callBackFn?.();
      } else {
        if (resultAction.payload) {
          openSnackbar({
            text: `${resultAction.payload}`,
            type: "error",
          });
        } else {
          openSnackbar({
            text: resultAction.error.message,
            type: "error",
          });
        }
      }
    },
    [dispatch],
  );

  const handleRefreshToken = useCallback(
    async ({
      callBackFn,
      body,
    }: {
      callBackFn?: () => void;
      body: RefreshTokenBody;
    }) => {
      const resultAction = await dispatch(refreshTokenAsync(body));
      if (refreshTokenAsync.fulfilled.match(resultAction)) {
        const { access_token, refresh_token } = resultAction.payload;
        if (access_token && refresh_token) {
          const decode = jwtDecode(access_token) as any;
          {
            nativeStorage.setItem("access_token", access_token);
            nativeStorage.setItem("refresh_token", refresh_token);
            dispatch(setCurrentUser(decode));
          }
        }
        callBackFn?.();
      } else {
        if (resultAction.payload) {
          openSnackbar({
            text: `${resultAction.payload}`,
            type: "error",
          });
        } else {
          openSnackbar({
            text: resultAction.error.message,
            type: "error",
          });
        }
      }
    },
    [dispatch],
  );

  const handleCheckExist = useCallback(
    async ({
      callBackFn,
      body,
    }: {
      callBackFn?: () => void;
      body: CheckExistBody;
    }) => {
      const resultAction = await dispatch(checkExistAsync(body));
      if (checkExistAsync.fulfilled.match(resultAction)) {
        const { access_token, refresh_token } = resultAction.payload;
        if (access_token && refresh_token) {
          const decode = jwtDecode(access_token) as any;
          {
            nativeStorage.setItem("access_token", access_token);
            nativeStorage.setItem("refresh_token", refresh_token);
            dispatch(setCurrentUser(decode));
          }
        }
        callBackFn?.();
      } else {
        if (resultAction.payload) {
          openSnackbar({
            text: `${resultAction.payload}`,
            type: "error",
          });
        } else {
          openSnackbar({
            text: resultAction.error.message,
            type: "error",
          });
        }
      }
    },
    [dispatch],
  );

  return {
    state,
    handleLogin,
    handleGetAccountInfo,
    handleCheckExist,
    handleRefreshToken,
  };
}
