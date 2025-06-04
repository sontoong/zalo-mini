import { combineReducers } from "@reduxjs/toolkit";

import zaUserSlice from "./slice/zaUserSlice";
import userSlice from "./slice/userSlice";

const rootReducer = combineReducers({
  zauser: zaUserSlice,
  user: userSlice,
});

export default rootReducer;
