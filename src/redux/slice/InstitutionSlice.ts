import { createSlice } from "@reduxjs/toolkit";

const institutionSlice = createSlice({
  name: "institution",
  initialState: [],
  reducers: {
    setInstitutions: (_state, action) => action.payload,
  },
});

export const { setInstitutions } = institutionSlice.actions;

export default institutionSlice.reducer;
