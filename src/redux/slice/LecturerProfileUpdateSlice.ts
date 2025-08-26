import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lecturer: {},
  lecturerUpdate: {},
  degrees: [],
  certifications: [],
  ownedCourses: [],
  attendedCourses: [],
  researchProjects: [],
};

const lecturerProfileUpdateSlice = createSlice({
  name: "lecturerProfileUpdate",
  initialState,
  reducers: {
    setLecturerProfileUpdate: (_state, action) => action.payload,
  },
});

export const { setLecturerProfileUpdate } = lecturerProfileUpdateSlice.actions;

export default lecturerProfileUpdateSlice.reducer;
