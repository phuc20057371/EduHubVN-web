import { createSlice } from "@reduxjs/toolkit";
import type { TrainingProgramPublic } from "../../types/TrainingProgram";

const initialState: TrainingProgramPublic[] = [];

const TrainingProgramPublicSlice = createSlice({
  name: "trainingProgramPublic",
  initialState,
  reducers: {
    setTrainingProgramsPublic: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setTrainingProgramsPublic } = TrainingProgramPublicSlice.actions;
export default TrainingProgramPublicSlice.reducer;
