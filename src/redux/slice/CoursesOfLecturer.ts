import { createSlice } from "@reduxjs/toolkit";

const CourseOfLecturerSlice = createSlice({
  name: "coursesOfLecturer",
  initialState: {},
  reducers: {
    setCoursesOfLecturer: (_state, action) => {
      return action.payload;
    },
  },
});

export const {setCoursesOfLecturer } = CourseOfLecturerSlice.actions

export default CourseOfLecturerSlice.reducer