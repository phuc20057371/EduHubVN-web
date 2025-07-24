import { createSlice } from "@reduxjs/toolkit";

const lecturerRequestSlice = createSlice({
  name: "lecturerRequests",
  initialState: {
    requests: [],
  },
  reducers: {
    setLecturerRequests: (_state, action) => action.payload,

  
    clearLecturerRequests: (state) => {
      state.requests = [];
    },
  },
});

export const { setLecturerRequests, clearLecturerRequests } = lecturerRequestSlice.actions;

export default lecturerRequestSlice.reducer;
