import { createSlice } from "@reduxjs/toolkit";
import type { RequestFromLecturer } from "../../types/Lecturer";


const initialState: RequestFromLecturer[] = [];

const requestOwnedCourseSlice = createSlice({
  name: "requestOwnedCourse",
  initialState,
  reducers: {
    setOwnedCourseRequests: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setOwnedCourseRequests } = requestOwnedCourseSlice.actions;

export default requestOwnedCourseSlice.reducer;
