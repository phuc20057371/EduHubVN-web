import { createSlice } from "@reduxjs/toolkit";

const applicationPendingSlice = createSlice({
  name: "applicationPending",
  initialState: {},
  reducers: {
    setApplications: (_state, action) => action.payload,
    clearApplications: () => ({})
  },
});
export const { setApplications, clearApplications } = applicationPendingSlice.actions;

export default applicationPendingSlice.reducer;

