import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

const settingSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSettingDetail: (state, payload) => {
      state.value = payload?.payload;
    },
  },
});

export const { setSettingDetail } = settingSlice.actions;

export default settingSlice.reducer;
