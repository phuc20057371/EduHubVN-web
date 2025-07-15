import { createSlice } from "@reduxjs/toolkit";

const partnerPendingUpdateSlice = createSlice({
  name: "partnerPendingUpdate",
  initialState: [],
  reducers: {
    setPartnerPendingUpdate: (_state, action) => action.payload,
    clearPartnerPendingUpdate: () => [],
  },
});

export const { setPartnerPendingUpdate, clearPartnerPendingUpdate } =
  partnerPendingUpdateSlice.actions;

export default partnerPendingUpdateSlice.reducer;
