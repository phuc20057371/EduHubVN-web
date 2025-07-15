import { createSlice } from "@reduxjs/toolkit";

const lecturerPendingCreateSlice = createSlice({
  name: "lecturerPendingCreate",
  initialState: [],
  reducers: {
    setLecturerPendingCreate: (_state, action) => action.payload,
    clearLecturerPendingCreate: () => []
  }
});

export const { setLecturerPendingCreate, clearLecturerPendingCreate } = lecturerPendingCreateSlice.actions;
export default lecturerPendingCreateSlice.reducer;