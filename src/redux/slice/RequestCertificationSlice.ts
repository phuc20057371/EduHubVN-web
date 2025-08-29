import { createSlice } from "@reduxjs/toolkit";
import type { RequestFromLecturer } from "../../types/RequestFromLecturer";

const initialState: RequestFromLecturer[] = [];

const requestCertificationSlice = createSlice({
  name: "requestCertification",
  initialState,
  reducers: {
    setCertificationRequests: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setCertificationRequests } = requestCertificationSlice.actions;

export default requestCertificationSlice.reducer;
