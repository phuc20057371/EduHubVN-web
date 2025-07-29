import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    course: {},
    member: [],
  },
];

const CourseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourse: (_state, action) => action.payload,
  },
});

export const { setCourse } = CourseSlice.actions;
export default CourseSlice.reducer;
