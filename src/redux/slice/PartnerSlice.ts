import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    setPartner: (_state, action) => action.payload,
    clearPartner: () => ({}),
  },
});

export const { setPartner, clearPartner } = partnerSlice.actions;

export default partnerSlice.reducer;
