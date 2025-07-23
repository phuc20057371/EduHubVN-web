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

const lecturerProfileSlice = createSlice({
  name: "lecturerProfile",
  initialState,
  reducers: {
    setLecturerProfile: (_state, action) => action.payload,
  },
});

export const { setLecturerProfile } = lecturerProfileSlice.actions;

export default lecturerProfileSlice.reducer;
