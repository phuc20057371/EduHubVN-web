import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  partner: {},
};

const partnerProfileSlice = createSlice({
  name: "partnerProfile",
  initialState,
  reducers: {
    setPartnerProfile: (_state, action) => action.payload,
  },
});

export const { setPartnerProfile } = partnerProfileSlice.actions;

export default partnerProfileSlice.reducer;
