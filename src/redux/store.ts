import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import applicationPendingReducer from "./slice/ApplicationPendingSlice";
import lecturerPendingUpdateReducer from "./slice/LecturerPendingUpdateSlice";
import lecturerPendingCreateReducer from "./slice/LecturerPendingCreateSlice";
import institutionPendingCreateReducer from "./slice/InstitutionPendingCreateSlice";
import institutionPendingUpdateReducer from "./slice/InstitutionPendingUpdateSlice";
import partnerPendingCreateReducer from "./slice/PartnerPendingCreateSlice";
import partnerPendingUpdateReducer from "./slice/PartnerPendingUpdateSlice";
import degreePendingCreateReducer from "./slice/DegreePendingCreateSlice";
import degreePendingUpdateReducer from "./slice/DegreePendingUpdateSlice";
import lecturerReducer from "./slice/LecturerSlice";
import institutionReducer from "./slice/InstitutionSlice";
import partnerReducer from "./slice/PartnerSlice";
import pendingLecturerReducer from "./slice/PendingLectuererSlice";
import pendingInstitutionReducer from "./slice/PendingInstitutionSlice";
import pendingPartnerReducer from "./slice/PendingPartnerSlice";
import lecturerProfileUpdateReducer from "./slice/LecturerProfileUpdateSlice";

import lecturerProfileReducer from "./slice/LecturerProfileSlice";
import lecturerRequestReducer from "./slice/LecturerRquestSlice";
import CoursesOfLecturerReducer from "./slice/CoursesOfLecturer"

import requestDegreeReducer from "./slice/RequestDegreeSlice";
import requestCertificationReducer from "./slice/RequestCertificationSlice";
import requestAttendedCourseReducer from "./slice/RequestAttendedCourseSlice";
import requestOwnedCourseReducer from "./slice/RequestOwnedCourseSlice";
import requestResearchProjectReducer from "./slice/RequestResearchProjectSlice";
import institutionProfileReducer from "./slice/InstitutionProfileSlice";
import partnerProfileReducer from "./slice/PartnerProfileSlice";
import subAdminReducer from "./slice/SubAdminSlice";
import TrainingProgramReducer from "./slice/TrainingProgramSlice";
import TrainingProgramReducer2 from "./slice/TrainingProgramSlice2";
import trainingProgramRequestReducer from "./slice/TrainingProgramRequestSlice";
import trainingProgramRequestReducer2 from "./slice/TrainingProgramRequestSlice2";

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
    lecturerRequests: lecturerRequestReducer,
    coursesOfLecturer: CoursesOfLecturerReducer,
    lecturerProfileUpdate: lecturerProfileUpdateReducer,
    institutionProfile: institutionProfileReducer,
    partnerProfile: partnerProfileReducer,
    trainingProgram: TrainingProgramReducer,
    trainingProgram2: TrainingProgramReducer2,
    trainingProgramRequest: trainingProgramRequestReducer,
    trainingProgramRequest2: trainingProgramRequestReducer2,

    requestDegree: requestDegreeReducer,
    requestCertification: requestCertificationReducer,
    requestAttendedCourse: requestAttendedCourseReducer,
    requestOwnedCourse: requestOwnedCourseReducer,
    requestResearchProject: requestResearchProjectReducer,
    


    subAdmin: subAdminReducer,
  },
});
