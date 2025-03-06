import { followOA } from "zmp-sdk";
import {
  authorize,
  getUserInfo,
  openPermissionSetting,
  getSetting,
} from "zmp-sdk/apis";
import { zaloRequests } from "./zalo.Api";
import { baseUserRequests, userRequests } from "./user.Api";

// Zalo.Api
const ZALO_BASE = "";
const Zalo = {
  authorize: authorize,
  getAccountInfo: getUserInfo,
  openPS: openPermissionSetting,
  followOA: followOA,
  getSetting: getSetting,
  getPhoneNumberRequest: (data: any) => zaloRequests.get(ZALO_BASE, data),
  getLocationRequest: (data: any) => zaloRequests.get(ZALO_BASE, data),
};

// Users.Api
const AUTH_BASE = "auth";
const Auth = {
  login: (data: any) => baseUserRequests.post(`${AUTH_BASE}/login`, data),
  refreshToken: (data: any) => userRequests.post(`${AUTH_BASE}/refresh`, data),
};

const USER_BASE = "user";
const User = {
  getAccountInfo: () => userRequests.get(`${USER_BASE}/me`),
};
const agent = { Zalo, User, Auth };
export default agent;
