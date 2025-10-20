import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TrainingProgramRequest } from "../../types/TrainingProgram";



interface TrainingProgramRequestPage {
  content: TrainingProgramRequest[];
  page: number;
  totalPages: number;
  totalElements: number;
}

interface TrainingProgramRequestState {
  programsByPage: Record<number, TrainingProgramRequest[]>; // 👈 quan trọng
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

const initialState: TrainingProgramRequestState = {
  programsByPage: {},
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
};

const trainingProgramRequestSlice = createSlice({
  name: "trainingProgram",
  initialState,
  reducers: {
    setTrainingProgramRequests: (state, action: PayloadAction<TrainingProgramRequestPage>) => {
      const { page, content, totalPages, totalElements } = action.payload;
      state.programsByPage[page] = content;
      // Update currentPage to the highest loaded page
      state.currentPage = Math.max(state.currentPage, page);
      state.totalPages = totalPages;
      state.totalElements = totalElements;
    },
    
  },
  
});

export const { setTrainingProgramRequests } = trainingProgramRequestSlice.actions;
export default trainingProgramRequestSlice.reducer;
