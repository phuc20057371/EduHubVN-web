import { createSlice } from "@reduxjs/toolkit";
import type { RequestFromLecturer } from "../../types/RequestFromLecturer";

const initialState: RequestFromLecturer[] = [];

const requestAttendedCourseSlice = createSlice({
  name: "requestAttendedCourse",
  initialState,
  reducers: {
    setAttendedCourseRequests: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setAttendedCourseRequests } = requestAttendedCourseSlice.actions;

export default requestAttendedCourseSlice.reducer;
