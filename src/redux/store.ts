import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./slice/userSlice"
import applicationPendingReducer from "./slice/ApplicationPendingSlice";
import lecturerPendingUpdateReducer from "./slice/LecturerPendingUpdateSlice";
import lecturerPendingCreateReducer from "./slice/LecturerPendingCreateSlice";
import institutionPendingCreateReducer from './slice/InstitutionPendingCreateSlice';
import institutionPendingUpdateReducer from './slice/InstitutionPendingUpdateSlice';
import partnerPendingCreateReducer from './slice/PartnerPendingCreateSlice';
import partnerPendingUpdateReducer from './slice/PartnerPendingUpdateSlice';
import degreePendingCreateReducer from './slice/DegreePendingCreateSlice';
import degreePendingUpdateReducer from './slice/degreePendingUpdateSlice';
import lecturerReducer from './slice/LecturerSlice';
import institutionReducer from './slice/InstitutionSlice';
import partnerReducer from './slice/PartnerSlice';
import pendingLecturerReducer from './slice/PendingLectuererSlice';
import pendingInstitutionReducer from './slice/PendingInstitutionSlice';
import pendingPartnerReducer from './slice/PendingPartnerSlice';

import lecturerProfileReducer from './slice/LecturerProfileSlice';

export const store = configureStore({
  reducer: {
    userProfile: userReducer,
    applicationPending: applicationPendingReducer,
    lecturer: lecturerReducer,
    institution: institutionReducer,
    partner: partnerReducer,
    lecturerPendingUpdate: lecturerPendingUpdateReducer,
    lecturerPendingCreate: lecturerPendingCreateReducer,
    institutionPendingCreate: institutionPendingCreateReducer,
    institutionPendingUpdate: institutionPendingUpdateReducer,
    partnerPendingCreate: partnerPendingCreateReducer,
    partnerPendingUpdate: partnerPendingUpdateReducer,
    degreePendingCreate: degreePendingCreateReducer,
    degreePendingUpdate: degreePendingUpdateReducer,

    pendingLecturer: pendingLecturerReducer,
    pendingInstitution: pendingInstitutionReducer,
    pendingPartner: pendingPartnerReducer,

    lecturerProfile: lecturerProfileReducer,

  },
});
