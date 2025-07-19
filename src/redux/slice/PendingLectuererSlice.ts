import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lecturer: {},
  degrees: [],
  certification: [],
};

const pendingLecturerSlice = createSlice({
  name: "pendingLecturer",
  initialState,
  reducers: {
    setPendingLecturer: (_state, action) => action.payload,
    clearPendingLecturer: (state) => {
      state.lecturer = {};
      state.degrees = [];
      state.certification = [];
    },
  },
});

export const { setPendingLecturer, clearPendingLecturer } = pendingLecturerSlice.actions;

export default pendingLecturerSlice.reducer;
