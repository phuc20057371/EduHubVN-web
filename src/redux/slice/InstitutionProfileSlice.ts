import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  institution: {},
};

const institutionProfileSlice = createSlice({
  name: "institutionProfile",
  initialState,
  reducers: {
    setInstitutionProfile: (_state, action) => action.payload,
  },
});

export const { setInstitutionProfile } = institutionProfileSlice.actions;

export default institutionProfileSlice.reducer;
