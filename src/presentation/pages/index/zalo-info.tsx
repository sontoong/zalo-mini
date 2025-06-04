import { useUser } from "../../hooks/useUser";
import { useZaUser } from "../../hooks/useZaUser";
import React, { useEffect, useMemo } from "react";

export const ZaloInfo = () => {
  const {
    state: zauserState,
    handleAuthorize,
    handleGetZaloAccountInfo,
    handleOpenPermissionSetting,
    handleGetPhoneNumber,
    handleGetLocation,
    handleGetSettings,
  } = useZaUser();

  const {
    state: userState,
    handleCheckExist,
    handleGetAccountInfo,
    handleLogin,
    handleRefreshToken,
  } = useUser();

  useEffect(() => {
    handleGetSettings();
  }, []);

  const keysToCheck = [
    "scope.userInfo",
    "scope.userLocation",
    "scope.userPhonenumber",
  ] as const;
  const authedInfoCount = useMemo(() => {
    return keysToCheck.filter((key) => zauserState?.settings[key] === true)
      .length;
  }, [zauserState?.settings]);

  return (
    <div className="flex flex-col gap-10 px-10 py-5">
      <div className="flex gap-5">
        <button
          onClick={() => {
            if (
              authedInfoCount < keysToCheck.length - 1 ||
              !zauserState?.settings["scope.userInfo"]
            ) {
              handleAuthorize({
                callBackFn: () => {
                  handleGetSettings();
                  handleGetZaloAccountInfo();
                  handleGetPhoneNumber();
                  handleGetLocation();
                },
              });
            } else {
              handleGetZaloAccountInfo();
              handleGetPhoneNumber();
              handleGetLocation();
            }
          }}
        >
          Get info Zalo
        </button>
        <button onClick={async () => handleOpenPermissionSetting()}>
          Open setting
        </button>
        <button
          onClick={() =>
            handleCheckExist({
              body: {
                customapp_id: "4",
                tenant_id: "31123",
                lang_id: "1",
              },
            })
          }
        >
          Check exist
        </button>
        {!userState ? (
          <button
            onClick={() =>
              handleLogin({
                body: {
                  customapp_id: "4",
                  tenant_id: "31123",
                  lang_id: "1",
                  name: zauserState?.currentUser.name ?? "",
                  phone: zauserState?.phoneNumber ?? "",
                },
              })
            }
          >
            Login
          </button>
        ) : null}
        <button
          onClick={() =>
            handleGetAccountInfo({
              params: {
                customapp_id: "4",
                tenant_id: "31123",
                lang_id: "1",
              },
            })
          }
        >
          View detail
        </button>
        <button
          onClick={() =>
            handleRefreshToken({
              body: {
                customapp_id: "4",
                lang_id: "1",
              },
            })
          }
        >
          Refresh
        </button>
      </div>
      <pre>Sale man: {JSON.stringify(userState?.saleManInfo, null, 2)}</pre>
    </div>
  );
};
