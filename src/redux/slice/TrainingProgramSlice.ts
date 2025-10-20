import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TrainingProgram } from "../../types/TrainingProgram";



interface TrainingProgramPage {
  content: TrainingProgram[];
  page: number;
  totalPages: number;
  totalElements: number;
}

interface TrainingProgramState {
  programsByPage: Record<number, TrainingProgram[]>; // 👈 quan trọng
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

const initialState: TrainingProgramState = {
  programsByPage: {},
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
};

const trainingProgramSlice = createSlice({
  name: "trainingProgram",
  initialState,
  reducers: {
    setTrainingPrograms: (state, action: PayloadAction<TrainingProgramPage>) => {
      const { page, content, totalPages, totalElements } = action.payload;
      state.programsByPage[page] = content;
      // Update currentPage to the highest loaded page
      state.currentPage = Math.max(state.currentPage, page);
      state.totalPages = totalPages;
      state.totalElements = totalElements;
    },
    
  },
  
});

export const { setTrainingPrograms } = trainingProgramSlice.actions;
export default trainingProgramSlice.reducer;
