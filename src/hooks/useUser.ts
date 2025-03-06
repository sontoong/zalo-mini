import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  getAccountInfo,
  login,
  LoginBody,
  setCurrentUser,
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
      const resultAction = await dispatch(login(body));
      if (login.fulfilled.match(resultAction)) {
        const { accessToken, refreshToken } = resultAction.payload;
        if (accessToken && refreshToken) {
          const decode = jwtDecode(accessToken) as any;
          {
            nativeStorage.setItem("access_token", accessToken);
            nativeStorage.setItem("refresh_token", refreshToken);
            dispatch(setCurrentUser(decode));
          }
        }
        if (callBackFn) {
          callBackFn();
        }
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
    }: {
      callBackFn?: () => void;
    } = {}) => {
      const resultAction = await dispatch(getAccountInfo());
      if (getAccountInfo.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
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
  };
}
