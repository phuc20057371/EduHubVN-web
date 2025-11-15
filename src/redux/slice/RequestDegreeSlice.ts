import { createSlice } from "@reduxjs/toolkit";
import type { RequestFromLecturer } from "../../types/Lecturer";


const initialState: RequestFromLecturer[] = [];

const requestDegreeSlice = createSlice({
  name: "requestDegree",
  initialState,
  reducers: {
    setDegreeRequests: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setDegreeRequests } = requestDegreeSlice.actions;

export default requestDegreeSlice.reducer;
