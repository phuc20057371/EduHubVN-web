import { createSlice } from "@reduxjs/toolkit";


const initialState: any[] = [];

const trainingProgramSlice2 = createSlice({
  name: "trainingProgram2",
  initialState,
  reducers: {
    setTrainingPrograms2: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setTrainingPrograms2 } = trainingProgramSlice2.actions;

export default trainingProgramSlice2.reducer;
