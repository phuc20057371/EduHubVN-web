import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "userProfile",
    initialState: {},
    reducers: {
        setUserProfile: (_state, action) => action.payload,
        clearUserProfile: () => {}
    }
});
export const { setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;