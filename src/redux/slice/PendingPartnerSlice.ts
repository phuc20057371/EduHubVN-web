import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const pendingPartnerSlice = createSlice({
  name: "pendingPartner",
  initialState,
  reducers: {
    setPendingPartner: (_state, action) => {
      return action.payload;
    },
    clearPendingPartner: () => {
      return initialState;
    },
  },
});
export const { setPendingPartner, clearPendingPartner } =
  pendingPartnerSlice.actions;
export default pendingPartnerSlice.reducer;
