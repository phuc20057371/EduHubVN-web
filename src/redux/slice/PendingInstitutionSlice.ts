import {createSlice} from '@reduxjs/toolkit';

const pendingInstitutionSlice = createSlice({
  name: 'pendingInstitution',
  initialState: {},
  reducers: {
    setPendingInstitution: (_state, action) =>  action.payload,
    clearPendingInstitution: () => ({}),
  },
});

export const { setPendingInstitution, clearPendingInstitution } = pendingInstitutionSlice.actions;
export default pendingInstitutionSlice.reducer;
