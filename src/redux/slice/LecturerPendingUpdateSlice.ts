import { createSlice } from "@reduxjs/toolkit";

const lecturerPendingUpdateSlice = createSlice({
  name: "lecturerPendingUpdate",
  initialState: [],
  reducers: {
    setLecturerPendingUpdate: (_state, action) => action.payload,
    clearLecturerPendingUpdate: () => []
  }
});

export const { setLecturerPendingUpdate, clearLecturerPendingUpdate } = lecturerPendingUpdateSlice.actions;
export default lecturerPendingUpdateSlice.reducer;
