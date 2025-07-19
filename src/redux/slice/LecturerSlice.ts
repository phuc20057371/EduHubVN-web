import { createSlice } from "@reduxjs/toolkit";

const lecturerSlice = createSlice({
  name: "lecturer",
  initialState: [],
  reducers: {
    setLecturers: (_state, action) => {
      return action.payload;
    },
    clearLecturers: () => {
      return [];
    },
  },
});

export const { setLecturers, clearLecturers } = lecturerSlice.actions;

export default lecturerSlice.reducer;
