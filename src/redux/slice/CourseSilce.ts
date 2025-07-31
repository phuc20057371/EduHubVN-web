import { createSlice, } from "@reduxjs/toolkit";
import type { Course } from "../../types/Course";
import type { Lecturer } from "../../types/Lecturer";

interface CourseStateItem {
  course: Course;
  members: {
    lecturer: Lecturer;
    courseRole: string;
  }[];
}

const initialState: CourseStateItem[] = [];

const CourseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourse: (_state, action) => action.payload,
    updateCourseMembers: (state, action) => {
      const { courseId, members } = action.payload;
      const courseIndex = state.findIndex((c) => c.course.id === courseId);
      if (courseIndex !== -1) {
        state[courseIndex].members = members;
      } else {
        console.warn(`Course with ID ${courseId} not found.`);
      }
    }
  },
});

export const { setCourse, updateCourseMembers } = CourseSlice.actions;
export default CourseSlice.reducer;
