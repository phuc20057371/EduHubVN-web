import { createSlice } from "@reduxjs/toolkit";

const institutionPendingCreateSlice = createSlice({
  name: "institutionPendingCreate",
  initialState: {
    pendingInstitutions: [],
  },
  reducers: {
    setInstitutionPendingCreate: (_state, action) => action.payload,
    clearInstitutionPendingCreate: () => ({ pendingInstitutions: [] }),
  },
});

export const { setInstitutionPendingCreate, clearInstitutionPendingCreate } = institutionPendingCreateSlice.actions;
export default institutionPendingCreateSlice.reducer;
