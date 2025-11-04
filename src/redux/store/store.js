import { configureStore } from "@reduxjs/toolkit";

// Example slice reducer
import userSlice from "../slices/userSlice";
import settingSlice from "../slices/settingSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    setting: settingSlice,
  },
});

export default store;
