import { createSlice } from "@reduxjs/toolkit";

const subAdminSlice = createSlice({
  name: "subAdmin",
  initialState: [],
  reducers: {
    setSubAdmins: (_state, action) => action.payload,
  },
});

export const {
  setSubAdmins,
} = subAdminSlice.actions;

export default subAdminSlice.reducer;
