import { createSlice } from "@reduxjs/toolkit";


const partnerSlice = createSlice({
  name: "partner",
  initialState : [],
  reducers: {
    setPartner: (_state, action) => action.payload,
    clearPartner: () => ([]),
    removePartner: (state, action) => {
      return state.filter((partner: any) => partner.id !== action.payload);
    },
  },
});

export const { setPartner, clearPartner, removePartner } = partnerSlice.actions;

export default partnerSlice.reducer;
