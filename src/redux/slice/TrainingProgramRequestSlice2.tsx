import { createSlice } from "@reduxjs/toolkit";
import type { TrainingProgramRequest } from "../../types/TrainingProgram";


const initialState: TrainingProgramRequest[] = [];

const trainingProgramRequestSlice2 = createSlice({
  name: "trainingProgramRequest2",
  initialState,
  reducers: {
    setTrainingProgramsRequest2: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setTrainingProgramsRequest2 } = trainingProgramRequestSlice2.actions;

export default trainingProgramRequestSlice2.reducer;
