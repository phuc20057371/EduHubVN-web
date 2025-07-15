import { createSlice } from "@reduxjs/toolkit";

const degreePendingUpdateSlice = createSlice({
  name: "degreePendingUpdate",
  initialState: [{ degree: {}, lecturer: {} }],
  reducers: {
    setDegreePendingUpdate: (_state, action) => {
      return action.payload;
    },
    clearDegreePendingUpdate: () => {
      return [];
    },
  },
});

export const { setDegreePendingUpdate, clearDegreePendingUpdate } =
  degreePendingUpdateSlice.actions;

export default degreePendingUpdateSlice.reducer;
