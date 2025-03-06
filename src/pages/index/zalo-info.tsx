import { useZaUser } from "../../hooks/useZaUser";
import React, { useEffect, useMemo } from "react";
import { Map } from "../../components/map";

export const ZaloInfo = () => {
  const {
    state: zauserState,
    handleAuthorize,
    handleGetAccountInfo,
    handleOpenPermissionSetting,
    handleFollowOA,
    handleGetPhoneNumber,
    handleGetLocation,
    handleGetSettings,
  } = useZaUser();

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
                  handleGetAccountInfo();
                  handleGetPhoneNumber();
                  handleGetLocation();
                },
              });
            } else {
              handleGetAccountInfo();
              handleGetPhoneNumber();
              handleGetLocation();
            }
          }}
        >
          Get info
        </button>
        <button onClick={async () => handleOpenPermissionSetting()}>
          Open setting
        </button>
        <button onClick={async () => handleFollowOA()}>Follow OA</button>
      </div>
      <div className="flex flex-col gap-5">
        <img src={zauserState?.currentUser.avatar} />
        <p>Name: {zauserState?.currentUser.name}</p>
        <p>Phone number: {zauserState?.phoneNumber}</p>
        <p>
          Location: {zauserState?.location.latitude}{" "}
          {zauserState?.location.longitude}
        </p>
        <div className="h-[300px] w-full">
          {zauserState?.location.provider ? (
            <Map
              lat={zauserState?.location.latitude}
              long={zauserState?.location.longitude}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
