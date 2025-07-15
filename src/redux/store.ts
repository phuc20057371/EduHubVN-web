import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./slice/userSlice"
import applicationPendingReducer from "./slice/ApplicationPendingSlice";
import lecturerPendingUpdateReducer from "./slice/LecturerPendingUpdateSlice";
import lecturerPendingCreateReducer from "./slice/LecturerPendingCreateSlice";
import institutionPendingCreateReducer from './slice/InstitutionPendingCreateSlice';
import institutionPendingUpdateReducer from './slice/InstitutionPendingUpdateSlice';
import partnerPendingCreateReducer from './slice/PartnerPendingCreateSlice';
import partnerPendingUpdateReducer from './slice/partnerPendingUpdateSlice';
import degreePendingCreateReducer from './slice/DegreePendingCreateSlice';
import degreePendingUpdateReducer from './slice/degreePendingUpdateSlice';

export const store = configureStore({
  reducer: {
    userProfile: userReducer,
    applicationPending: applicationPendingReducer,
    lecturerPendingUpdate: lecturerPendingUpdateReducer,
    lecturerPendingCreate: lecturerPendingCreateReducer,
    institutionPendingCreate: institutionPendingCreateReducer,
    institutionPendingUpdate: institutionPendingUpdateReducer,
    partnerPendingCreate: partnerPendingCreateReducer,
    partnerPendingUpdate: partnerPendingUpdateReducer,
    degreePendingCreate: degreePendingCreateReducer,
    degreePendingUpdate: degreePendingUpdateReducer,
  },
});
