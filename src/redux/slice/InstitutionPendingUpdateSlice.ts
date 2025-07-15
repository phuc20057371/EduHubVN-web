
import { createSlice } from '@reduxjs/toolkit';

const institutionPendingUpdateSlice = createSlice({
    name: 'institutionPendingUpdate',
    initialState: [],
    reducers: {
        setInstitutionPendingUpdate: (_state, action) => action.payload,
        clearInstitutionPendingUpdate: () => [],

    },
});

export const { setInstitutionPendingUpdate, clearInstitutionPendingUpdate } = institutionPendingUpdateSlice.actions;
export default institutionPendingUpdateSlice.reducer;