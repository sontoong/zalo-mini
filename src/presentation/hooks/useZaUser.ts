import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  getZaloAccountInfo,
  authorize,
  setCurrentUser,
  openPS,
  followOA,
  getPhoneNumberRequest,
  getLocationRequest,
  setPhoneNumber,
  setLocation,
  getSettings,
  setSettings,
} from "../redux/slice/zaUserSlice";
import { useSnackbar } from "zmp-ui";

export function useZaUser() {
  const { openSnackbar } = useSnackbar();
  const state = useAppSelector((state) => state.zauser);
  const dispatch = useAppDispatch();

  const handleAuthorize = useCallback(
    async ({ callBackFn }: { callBackFn?: () => void } = {}) => {
      const resultAction = await dispatch(authorize());
      if (authorize.fulfilled.match(resultAction)) {
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

  const handleGetZaloAccountInfo = useCallback(async () => {
    const resultAction = await dispatch(getZaloAccountInfo());
    if (getZaloAccountInfo.fulfilled.match(resultAction)) {
      dispatch(setCurrentUser(resultAction.payload));
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
  }, [dispatch]);

  const handleOpenPermissionSetting = useCallback(async () => {
    const resultAction = await dispatch(openPS());
    if (openPS.fulfilled.match(resultAction)) {
      // dispatch(setCurrentUser(resultAction.payload));
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
  }, [dispatch]);

  const handleFollowOA = useCallback(async () => {
    const resultAction = await dispatch(followOA());
    if (followOA.fulfilled.match(resultAction)) {
      // dispatch(setCurrentUser(resultAction.payload));
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
  }, [dispatch]);

  const handleGetPhoneNumber = useCallback(async () => {
    const resultAction = await dispatch(getPhoneNumberRequest());
    if (getPhoneNumberRequest.fulfilled.match(resultAction)) {
      dispatch(setPhoneNumber(resultAction.payload));
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
  }, [dispatch]);

  const handleGetLocation = useCallback(async () => {
    const resultAction = await dispatch(getLocationRequest());
    if (getLocationRequest.fulfilled.match(resultAction)) {
      const { latitude, longitude, ...rest } = resultAction.payload;
      dispatch(
        setLocation({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          ...rest,
        }),
      );
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
  }, [dispatch]);

  const handleGetSettings = useCallback(async () => {
    const resultAction = await dispatch(getSettings());
    if (getSettings.fulfilled.match(resultAction)) {
      dispatch(setSettings(resultAction.payload));
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
  }, [dispatch]);

  return {
    state,
    handleAuthorize,
    handleGetZaloAccountInfo,
    handleOpenPermissionSetting,
    handleFollowOA,
    handleGetPhoneNumber,
    handleGetLocation,
    handleGetSettings,
  };
}
