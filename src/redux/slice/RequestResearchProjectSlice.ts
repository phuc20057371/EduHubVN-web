import { createSlice } from "@reduxjs/toolkit";
import type { RequestFromLecturer } from "../../types/Lecturer";

const initialState: RequestFromLecturer[] = [];

const requestResearchProjectSlice = createSlice({
  name: "requestResearchProject",
  initialState,
  reducers: {
    setResearchProjectRequests: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setResearchProjectRequests } =
  requestResearchProjectSlice.actions;

export default requestResearchProjectSlice.reducer;
