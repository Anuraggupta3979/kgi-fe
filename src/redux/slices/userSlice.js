import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetail: (state, payload) => {
      state.value = payload?.payload;
    },
  },
});

export const { setUserDetail } = userSlice.actions;

export default userSlice.reducer;
