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
  refreshToken: (data: any) =>
    baseUserRequests.post(`${AUTH_BASE}/refresh-token`, data),
  checkExist: (data: any) =>
    baseUserRequests.post(`${AUTH_BASE}/check-exist`, data),
};

const USER_BASE = "saleman";
const User = {
  getAccountInfo: (params: any) =>
    userRequests.get(`${USER_BASE}/view`, params),
};

const agent = { Zalo, User, Auth };
export default agent;
