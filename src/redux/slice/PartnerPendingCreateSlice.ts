import { createSlice } from "@reduxjs/toolkit";

const partnerPendingCreateSlice = createSlice({
  name: "partnerPendingCreate",
  initialState: [],
  reducers: {
    setPartnerPendingCreate: (_state, action) => action.payload,
    clearPartnerPendingCreate: () => [],
  },
});

export const { setPartnerPendingCreate, clearPartnerPendingCreate } =
  partnerPendingCreateSlice.actions;

export default partnerPendingCreateSlice.reducer;
