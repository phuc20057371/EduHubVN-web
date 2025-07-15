import { createSlice } from "@reduxjs/toolkit";

const degreePendingCreateSlice = createSlice({
  name: "degreePendingCreate",
  initialState: [{ degree: {}, lecturer: {} }],
  reducers: {
    setDegreePendingCreate: (_state, action) => {
      return action.payload;
    },
    clearDegreePendingCreate: () => {
      return [];
    },
  },
});

export const { setDegreePendingCreate, clearDegreePendingCreate } =
  degreePendingCreateSlice.actions;

export default degreePendingCreateSlice.reducer;
