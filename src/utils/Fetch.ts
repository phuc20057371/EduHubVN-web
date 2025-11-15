import axios from "axios";

import { toast } from "react-toastify";
import type { CreateInstitutionReq, CreateLecturerReq, CreatePartnerReq } from "../types/Admin";
import type { AttendedCourseCreateReq, AttendedCourseUpdateReq } from "../types/AttendedCourse";
import type { ChangePasswordReq, LoginReq, ResetPasswordReq, ResetPasswordUserReq } from "../types/Authen";
import type { Certification, CertificationUpdateReq } from "../types/Certification";
import type { Degree, DegreeUpdateReq } from "../types/Degree";
import type { EmailReq, EmailSent } from "../types/Email";
import type { IdReq } from "../types/IdReq";
import type { Institution, InstitutionCreateReq, InstitutionUpdateReq } from "../types/Institution";
import type { Lecturer, LecturerCreateReq } from "../types/Lecturer";
import type { AssignPermissionsReq } from "../types/Mod";
import type { OwnedCourseCreateReq, OwnedCourseUpdateReq } from "../types/OwnedCourse";
import type { Partner, PartnerCreateReq, PartnerUpdateReq } from "../types/Parner";
import type { RejectReq } from "../types/RejectReq";
import type { ResearchProjectCreateReq, ResearchProjectUpdateReq } from "../types/ResearchProject";
import type {
  TrainingProgramReq,
  TrainingProgramRequestReq,
} from "../types/TrainingProgram";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const domain = window.location.hostname;
// const BASE_URL = `http://${domain}:8888`;

const fetch = axios.create({
  baseURL: BASE_URL,
});

fetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

fetch.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          const response = await axios.post(
            `${BASE_URL}/api/v1/auth/refresh`,
            null,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            },
          );
          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          localStorage.setItem("accessToken", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return fetch(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        handleTokenExpiration();
        return Promise.reject(refreshError);
      }
    }

    // Trường hợp 401 nhưng đã retry rồi
    if (error.response?.status === 401) {
      handleTokenExpiration();
    }

    return Promise.reject(error);
  },
);

// Hàm xử lý khi token hết hạn
const handleTokenExpiration = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  window.location.href = "/login";
};

export const API = {
  auth: {
    login: (data: LoginReq) => fetch.post("/api/v1/auth/login", data),
    register: (data: any) => fetch.post("/api/v1/auth/register", data),
    sendOtp: (email: string) => fetch.post("/api/v1/auth/send-otp", { email }),
    refresh: (refreshToken: string) =>
      fetch.post("/api/v1/auth/refresh", { refreshToken }),
    logout: () => fetch.post("/api/v1/auth/logout"),
    forgotPassword: (data: EmailReq) =>
      fetch.post("/api/v1/auth/forgot-password", data),
    resetPassword: (data: ResetPasswordUserReq) =>
      fetch.post("/api/v1/auth/reset-password", data),
  },
  user: {
    uploadFile: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch.post("/api/v1/user/upload", formData);
    },
    uploadFileToServer: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch.post("/api/v1/user/uploads", formData);
    },
    getUserProfile: () => fetch.get("/api/v1/user/user-profile"),
    sendOTPChangePassword: (data: EmailReq) =>
      fetch.post("/api/v1/user/send-otp-change-password", data),
    changePassword: (data: ChangePasswordReq) =>
      fetch.post("/api/v1/user/change-password", data),
    sendSubEmailOtp: (data: EmailReq) =>
      fetch.post("/api/v1/user/send-otp-add-subemail", data),
    addSubEmail: (data: EmailReq) =>
      fetch.post("/api/v1/user/add-subemail", data),
    removeSubEmail: (data: { email: string }) =>
      fetch.post("/api/v1/user/remove-subemail", data),
    //Leccturer
    registerLecturer: (data: LecturerCreateReq) =>
      fetch.post("/api/v1/user/register-lecturer", data),
    updateLecturer: (data: LecturerCreateReq) =>
      fetch.post("/api/v1/user/update-lecturer", data),
    getPendingLecturer: () =>
      fetch.get("/api/v1/user/pending-lecturer-profile"),
    updatePendingLecturer: (data: any) =>
      fetch.post("/api/v1/user/resubmit-lecturer", data),
    uploadAvatar: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch.post("/api/v1/lecturer/update-avatar", formData);
    },
    // Institution
    registerInstitution: (data: InstitutionCreateReq) =>
      fetch.post("/api/v1/user/register-institution", data),
    updateInstitution: (data: InstitutionUpdateReq) =>
      fetch.post("/api/v1/user/update-institution", data),
    getPendingInstitution: () =>
      fetch.get("/api/v1/user/pending-institution-profile"),
    updateLogoInstitution: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch.post("/api/v1/institution/update-logo", formData);
    },
    // Partner
    registerPartner: (data: PartnerCreateReq) =>
      fetch.post("/api/v1/user/register-partner", data),
    updatePartner: (data: PartnerUpdateReq) =>
      fetch.post("/api/v1/user/update-partner", data),
    getPendingPartner: () => fetch.get("/api/v1/user/pending-partner-profile"),
    updateLogoPartner: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch.post("/api/v1/partner/update-logo", formData);
    },
    // Degree
    createDegree: (data: any) => fetch.post("/api/v1/user/create-degree", data),
    updateDegree: (data: Degree) =>
      fetch.post("/api/v1/user/update-degree", data),
    editDegree: (data: DegreeUpdateReq) =>
      fetch.post("/api/v1/user/edit-degree", data),
    deleteDegree: (data: string) =>
      fetch.post("/api/v1/user/delete-degree", { id: data }),
    // Certification
    createCertification: (data: any) =>
      fetch.post("/api/v1/user/create-certification", data),
    updateCertification: (data: Certification) =>
      fetch.post("/api/v1/user/update-certification", data),
    editCertification: (data: CertificationUpdateReq) =>
      fetch.post("/api/v1/user/edit-certification", data),
    deleteCertification: (data: string) =>
      fetch.post("/api/v1/user/delete-certification", { id: data }),
  },
  lecturer: {
    // Get
    getLecturerProfile: () => fetch.get("/api/v1/lecturer/lecturer-profile"),
    getAllCourses: () => fetch.get("/api/v1/lecturer/get-all-courses"),
    // Lecturer
    updateProfile: (data: LecturerCreateReq) =>
      fetch.post("/api/v1/lecturer/update-profile", data),
    // Degree
    // Certification

    // Attended Courses
    createAttendedCourse: (data: AttendedCourseCreateReq) =>
      fetch.post("/api/v1/lecturer/create-attended-course", data),
    updateAttendedCourse: (data: AttendedCourseUpdateReq) =>
      fetch.post("/api/v1/lecturer/update-attended-course", data),
    editAttendedCourse: (data: AttendedCourseUpdateReq) =>
      fetch.post("/api/v1/lecturer/edit-attended-course", data),
    deleteAttendedCourse: (data: IdReq) =>
      fetch.post("/api/v1/lecturer/delete-attended-course", { id: data }),
    // Owned Courses
    createOwnedCourse: (data: OwnedCourseCreateReq) =>
      fetch.post("/api/v1/lecturer/create-owned-course", data),
    updateOwnedCourse: (data: OwnedCourseUpdateReq) =>
      fetch.post("/api/v1/lecturer/update-owned-course", data),
    editOwnedCourse: (data: OwnedCourseUpdateReq) =>
      fetch.post("/api/v1/lecturer/edit-owned-course", data),
    deleteOwnedCourse: (data: IdReq) =>
      fetch.post("/api/v1/lecturer/delete-owned-course", { id: data }),
    // Research Projects
    createResearchProject: (data: ResearchProjectCreateReq) =>
      fetch.post("/api/v1/lecturer/create-research-project", data),
    updateResearchProject: (data: ResearchProjectUpdateReq) =>
      fetch.post("/api/v1/lecturer/update-research-project", data),
    editResearchProject: (data: ResearchProjectUpdateReq) =>
      fetch.post("/api/v1/lecturer/edit-research-project", data),
    deleteResearchProject: (data: IdReq) =>
      fetch.post("/api/v1/lecturer/delete-research-project", { id: data }),
    hiddenProfile: (data: any) =>
      fetch.post("/api/v1/lecturer/hidden-profile", data),
  },
  institution: {
    // Get
    getLecturers: () => fetch.get("/api/v1/institution/get-lecturers"),
    // Institution
    updateInstitutionProfile: (data: InstitutionUpdateReq) =>
      fetch.post("/api/v1/institution/update-profile", data),
    getInstitutionProfile: () =>
      fetch.get("/api/v1/institution/get-institution-profile"),
  },
  partner: {
    // Get
    getPartnerProfile: () => fetch.get("/api/v1/partner/get-partner-profile"),
    // Partner
    updatePartnerProfile: (data: PartnerCreateReq) =>
      fetch.post("/api/v1/partner/update-profile", data),
    getAllProgramRequests: () =>
      fetch.get("/api/v1/partner/get-all-training-program-requests"),
    createProgramRequest: (data: TrainingProgramRequestReq) =>
      fetch.post("/api/v1/partner/create-training-program-request", data),
  },
  admin: {
    //Get
    getLecturerPendingUpdate: () =>
      fetch.get("/api/v1/admin/lecturer-pending-updates"),
    getLecturerPendingCreate: () =>
      fetch.get("/api/v1/admin/lecturer-pending-create"),
    getInstitutionPendingUpdate: () =>
      fetch.get("/api/v1/admin/institution-pending-updates"),
    getInstitutionPendingCreate: () =>
      fetch.get("/api/v1/admin/institution-pending-create"),
    getPartnerPendingUpdate: () =>
      fetch.get("/api/v1/admin/partner-pending-updates"),
    getPartnerPendingCreate: () =>
      fetch.get("/api/v1/admin/partner-pending-create"),

    getAllLecturers: () => fetch.get("/api/v1/admin/get-all-lecturers"),
    getAllInstitutions: () => fetch.get("/api/v1/admin/get-all-institutions"),
    getAllPartners: () => fetch.get("/api/v1/admin/get-all-partners"),

    // getLecturerCreateReqs: () => fetch.get("/api/v1/admin/get-lecturer-requests"),
    getLecturerAllProfile: (data: IdReq) =>
      fetch.get("/api/v1/admin/get-lecturer-all-profile/" + data.id),

    getDegreeRequests: () => fetch.get("/api/v1/admin/get-degree-requests"),
    getCertificationRequests: () =>
      fetch.get("/api/v1/admin/get-certification-requests"),
    getAttendedCourseRequests: () =>
      fetch.get("/api/v1/admin/get-attended-course-requests"),
    getOwnedCourseRequests: () =>
      fetch.get("/api/v1/admin/get-owned-course-requests"),
    getResearchProjectRequests: () =>
      fetch.get("/api/v1/admin/get-research-project-requests"),
    //Lecturer
    approveLecturer: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-lecturer", data),
    rejectLecturer: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-lecturer", data),
    approveLecturerUpdate: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-lecturer-update", data),
    rejectLecturerUpdate: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-lecturer-update", data),
    updateLecturer: (data: Lecturer) =>
      fetch.post("/api/v1/admin/update-lecturer", data),
    deleteLecturer: (data: IdReq) =>
      fetch.post("/api/v1/admin/delete-lecturer", data),
    createLecturer: (data: CreateLecturerReq) =>
      fetch.post("/api/v1/admin/create-lecturer", data),

    // Institution
    approveInstitution: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-institution", data),
    rejectInstitution: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-institution", data),
    approveInstitutionUpdate: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-institution-update", data),
    rejectInstitutionUpdate: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-institution-update", data),
    updateInstitution: (data: Institution) =>
      fetch.post("/api/v1/admin/update-institution", data),
    deleteInstitution: (data: IdReq) =>
      fetch.post("/api/v1/admin/delete-institution", data),
    createInstitution: (data: CreateInstitutionReq) =>
      fetch.post("/api/v1/admin/create-institution", data),
    // Partner

    approvePartner: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-partner", data),
    rejectPartner: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-partner", data),
    approvePartnerUpdate: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-partner-update", data),
    rejectPartnerUpdate: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-partner-update", data),

    updatePartner: (data: Partner) =>
      fetch.post("/api/v1/admin/update-partner", data),
    deletePartner: (data: IdReq) =>
      fetch.post("/api/v1/admin/delete-partner", data),
    createPartner: (data: CreatePartnerReq) =>
      fetch.post("/api/v1/admin/create-partner", data),
    // Degree

    approveDegree: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-degree", data),
    rejectDegree: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-degree", data),
    approveDegreeUpdate: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-degree-update", data),
    rejectDegreeUpdate: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-degree-update", data),
    createDegree: (data: any, lecturerId: string) =>
      fetch.post(`/api/v1/admin/create-degree/${lecturerId}`, data),
    deleteDegree: (data: IdReq) =>
      fetch.post("/api/v1/admin/delete-degree", data),

    // Certification
    approveCertification: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-certification", data),
    rejectCertification: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-certification", data),
    approveCertificationUpdate: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-certification-update", data),
    rejectCertificationUpdate: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-certification-update", data),
    createCertification: (data: any, lecturerId: string) =>
      fetch.post(`/api/v1/admin/create-certification/${lecturerId}`, data),
    deleteCertification: (data: IdReq) =>
      fetch.post("/api/v1/admin/delete-certification", data),

    // Attended Courses
    approveAttendedCourse: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-attended-course", data),
    rejectAttendedCourse: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-attended-course", data),
    approveAttendedCourseUpdate: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-attended-course-update", data),
    rejectAttendedCourseUpdate: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-attended-course-update", data),
    createAttendedCourse: (data: any, lecturerId: string) =>
      fetch.post(`/api/v1/admin/create-attended-course/${lecturerId}`, data),
    deleteAttendedCourse: (data: IdReq) =>
      fetch.post("/api/v1/admin/delete-attended-course", data),

    // Owned Courses
    approveOwnedCourse: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-owned-course", data),
    rejectOwnedCourse: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-owned-course", data),
    approveOwnedCourseUpdate: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-owned-course-update", data),
    rejectOwnedCourseUpdate: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-owned-course-update", data),
    createOwnedCourse: (data: any, lecturerId: string) =>
      fetch.post(`/api/v1/admin/create-owned-course/${lecturerId}`, data),
    deleteOwnedCourse: (data: IdReq) =>
      fetch.post("/api/v1/admin/delete-owned-course", data),

    // Research Projects
    approveResearchProject: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-research-project", data),
    rejectResearchProject: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-research-project", data),
    approveResearchProjectUpdate: (data: IdReq) =>
      fetch.post("/api/v1/admin/approve-research-project-update", data),
    rejectResearchProjectUpdate: (data: RejectReq) =>
      fetch.post("/api/v1/admin/reject-research-project-update", data),
    createResearchProject: (data: any, lecturerId: string) =>
      fetch.post(`/api/v1/admin/create-research-project/${lecturerId}`, data),
    deleteResearchProject: (data: IdReq) =>
      fetch.post("/api/v1/admin/delete-research-project", data),

    // Course
    // getAllCourses: () => fetch.get("/api/v1/admin/get-all-courses"),
    // getCourseById: (id: number) => fetch.get(`/api/v1/admin/get-course/${id}`),
    // updateCourseMember: (data: any) =>
    //   fetch.post("/api/v1/admin/update-course-member", data),
    // getOwnedCourses: () => fetch.get("/api/v1/admin/get-new-owned-courses"),
    // createCourse: (data: any) =>
    //   fetch.post("/api/v1/admin/create-course", data),
    // updateCourse: (data: any) =>
    //   fetch.post("/api/v1/admin/update-course", data),
    // deleteCourse: (data: IdReq) =>
    //   fetch.post("/api/v1/admin/delete-course", data),
  },
  subadmin: {
    getAllSubAdmins: () => fetch.get("/api/v1/admin/sub-admin/all"),
    assignPermissions: (data: AssignPermissionsReq) =>
      fetch.post("/api/v1/admin/sub-admin/assign-permissions", data),
    createSubAdmin: (data: LoginReq) =>
      fetch.post("/api/v1/admin/sub-admin/create", data),
    deleteSubAdmin: (data: IdReq) =>
      fetch.delete("/api/v1/admin/sub-admin/" + data.id),
    resetPassword: (data: ResetPasswordReq) =>
      fetch.post("/api/v1/admin/sub-admin/reset-password", data),
  },
  program: {
    getAllPrograms: () => fetch.get("/api/v1/admin/get-all-training-programs"),
    getAllProgramsPaginated: (page = 0, size = 10) =>
      fetch.get(
        `/api/v1/admin/get-all-training-programs-paginated?page=${page}&size=${size}`,
      ),
    getAllProgramRequestsPaginated: (page = 0, size = 10) =>
      fetch.get(
        `/api/v1/admin/get-training-program-requests?page=${page}&size=${size}`,
      ),
    getAllProgramRequests: () =>
      fetch.get("api/v1/admin/get-all-program-requests"),

    createProgram: (data: TrainingProgramReq) =>
      fetch.post("/api/v1/admin/create-training-program", data),
    updateProgram: (data: TrainingProgramReq) =>
      fetch.post(`/api/v1/admin/update-training-program/${data.id}`, data),
    updateProgramUnits: (id: string, data: any) =>
      fetch.post(`/api/v1/admin/update-training-program-units/${id}`, data),
    archiveTrainingProgram: (id: string) =>
      fetch.post(`/api/v1/admin/archive-training-program/${id}`),
    unarchiveTrainingProgram: (id: string) =>
      fetch.post(`/api/v1/admin/unarchive-training-program/${id}`),
    rejectProgramRequest: (data: IdReq) =>
      fetch.post("/api/v1/admin/reject-training-program-request", data),
    unrejectProgramRequest: (data: IdReq) =>
      fetch.post("/api/v1/admin/unreject-training-program-request", data),
  },
  public: {
    getAllCourses: () => {
      return fetch.get(`/public/all-courses`);
    },
    getTop7Lecturers: () => {
      return fetch.get(`/public/top-7-lecturers`);
    },
    getAllTrainingPrograms: () =>
      fetch.get("/public/get-all-training-programs"),
    getTop6Lecturers: () => {
      return fetch.get("/public/get-top-6-lecturers");
    },

    getAllPublicLecturers: () => {
      return fetch.get("/public/get-all-lecturers-with-rating");
    },
    getLecturerbyId: (id: string) => {
      return fetch.get(`/public/get-lecturer-by-id-with-rating?id=${id}`);
    },
    getTrainingProgrambyId: (id: string) => {
      return fetch.get(`/public/get-training-program-by-id?id=${id}`);
    },
  },
  other: {
    getLecturerProfile: (id: string) => {
      return fetch.get(`/api/v1/user/lecturer-profile/${id}`);
    },
    checkCitizenId: (citizenId: string) => {
      return fetch.get("/api/v1/user/check-citizen-id/" + citizenId);
    },
    sendEmail: (data: EmailSent) => {
      return fetch.post("/api/v1/auth/send-mail", data);
    },
  },
};
