import axios from "axios";
import type { LoginRequest } from "../types/LoginRequest";
import type { InstitutionRequest } from "../types/InstitutionRequest";
import type { PartnerRequest } from "../types/PartnerRequest";

import { toast } from "react-toastify";
import type { LecturerRequest } from "../types/LecturerRequest";
import type { IdRequest } from "../types/IdRequest";
import type { RejectRequest } from "../types/RejectRequest";
import type { DegreeUpdateRequest } from "../types/DegreeUpdateRequest";
import type { CertificationUpdateRequest } from "../types/CertificationUpdateRequest";
import type {
  AttendedTrainingCourseRequest,
  AttendedTrainingCourseUpdateRequest,
} from "../types/AttendedTrainingCourseRequest";
import type {
  OwnedTrainingCourseRequest,
  OwnedTrainingCourseUpdateRequest,
} from "../types/OwnedTrainingCourseRequest";
import type {
  ResearchProjectRequest,
  ResearchProjectUpdateRequest,
} from "../types/ResearchProjectRequest";
import type { Lecturer } from "../types/Lecturer";
import type { Institution } from "../types/Institution";
import type { Partner } from "../types/Parner";

// const BASE_URL = "http://localhost:8080";
const domain = window.location.hostname;
const BASE_URL = `http://${domain}:8080`;
// const BASE_URL = "http://172.16.10.25:8080";
// const BASE_URL = "http://10.10.40.240:8080";
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
    login: (data: LoginRequest) => fetch.post("/api/v1/auth/login", data),
    register: (data: any) => fetch.post("/api/v1/auth/register", data),
    sendOtp: (email: string) => fetch.post("/api/v1/auth/send-otp", { email }),
    refresh: (refreshToken: string) =>
      fetch.post("/api/v1/auth/refresh", { refreshToken }),
    logout: () => fetch.post("/api/v1/auth/logout"),
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

    //Leccturer
    registerLecturer: (data: LecturerRequest) =>
      fetch.post("/api/v1/user/register-lecturer", data),
    updateLeccturer: (data: LecturerRequest) =>
      fetch.post("/api/v1/user/update-lecturer", data),

    getPendingLecturer: () =>
      fetch.get("/api/v1/user/pending-lecturer-profile"),

    updatePendingLecturer: (data: any) =>
      fetch.post("/api/v1/user/resubmit-lecturer", data),
    // Institution
    registerInstitution: (data: InstitutionRequest) =>
      fetch.post("/api/v1/user/register-institution", data),
    updateInstitution: (data: InstitutionRequest) =>
      fetch.post("/api/v1/user/update-institution", data),

    getPendingInstitution: () =>
      fetch.get("/api/v1/user/pending-institution-profile"),
    // Partner
    registerPartner: (data: PartnerRequest) =>
      fetch.post("/api/v1/user/register-partner", data),
    updatePartner: (data: PartnerRequest) =>
      fetch.post("/api/v1/user/update-partner", data),

    getPendingPartner: () => fetch.get("/api/v1/user/pending-partner-profile"),
    // Degree
    createDegree: (data: any) => fetch.post("/api/v1/user/create-degree", data),
    deleteDegree: (data: string) =>
      fetch.post("/api/v1/user/delete-degree", {id: data}),

    // Certification
    createCertification: (data: any) =>
      fetch.post("/api/v1/user/create-certification", data),
    deleteCertification: (data: string) =>
      fetch.post("/api/v1/user/delete-certification", {id: data}),
  },
  lecturer: {
    // Get
    getLecturerProfile: () => fetch.get("/api/v1/lecturer/lecturer-profile"),
    // Lecturer
    updateProfile: (data: LecturerRequest) =>
      fetch.post("/api/v1/lecturer/update-profile", data),
    // Degree
    updateDegree: (data: DegreeUpdateRequest) =>
      fetch.post("/api/v1/lecturer/update-degree", data),
    editDegree: (data: DegreeUpdateRequest) =>
      fetch.post("/api/v1/lecturer/edit-degree", data),
    // Certification
    updateCertification: (data: CertificationUpdateRequest) =>
      fetch.post("/api/v1/lecturer/update-certification", data),
    editCertification: (data: CertificationUpdateRequest) =>
      fetch.post("/api/v1/lecturer/edit-certification", data),
    // Attended Courses
    createAttendedCourse: (data: AttendedTrainingCourseRequest) =>
      fetch.post("/api/v1/lecturer/create-attended-course", data),
    updateAttendedCourse: (data: AttendedTrainingCourseUpdateRequest) =>
      fetch.post("/api/v1/lecturer/update-attended-course", data),
    editAttendedCourse: (data: AttendedTrainingCourseUpdateRequest) =>
      fetch.post("/api/v1/lecturer/edit-attended-course", data),
    // Owned Courses
    createOwnedCourse: (data: OwnedTrainingCourseRequest) =>
      fetch.post("/api/v1/lecturer/create-owned-course", data),
    updateOwnedCourse: (data: OwnedTrainingCourseUpdateRequest) =>
      fetch.post("/api/v1/lecturer/update-owned-course", data),
    editOwnedCourse: (data: OwnedTrainingCourseUpdateRequest) =>
      fetch.post("/api/v1/lecturer/edit-owned-course", data),
    // Research Projects
    createResearchProject: (data: ResearchProjectRequest) =>
      fetch.post("/api/v1/lecturer/create-research-project", data),
    updateResearchProject: (data: ResearchProjectUpdateRequest) =>
      fetch.post("/api/v1/lecturer/update-research-project", data),
    editResearchProject: (data: ResearchProjectUpdateRequest) =>
      fetch.post("/api/v1/lecturer/edit-research-project", data),
  },
  institution: {
    // Get

    // Institution
    updateInstitutionProfile: (data: InstitutionRequest) =>
      fetch.post("/api/v1/institution/update-profile", data),
  },
  partner: {
    // Get

    // Partner
    updatePartnerProfile: (data: PartnerRequest) =>
      fetch.post("/api/v1/partner/update-profile", data),
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
    getDegreePendingCreate: () =>
      fetch.get("/api/v1/admin/degree-pending-create"),
    getDegreePendingUpdate: () =>
      fetch.get("/api/v1/admin/degree-pending-updates"),

    getAllPendingUpdates: () => fetch.get("/api/v1/admin/pending-updates"),
    getAllPendingApplications: () =>
      fetch.get("/api/v1/admin/pending-application"),

    getAllLecturers: () => fetch.get("/api/v1/admin/get-all-lecturers"),
    getAllInstitutions: () => fetch.get("/api/v1/admin/get-all-institutions"),
    getAllPartners: () => fetch.get("/api/v1/admin/get-all-partners"),

    getLecturerRequests: () =>
      fetch.get("/api/v1/admin/get-lecturer-requests"),
    //Lecturer
    approveLecturer: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-lecturer", data),
    rejectLecturer: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-lecturer", data),
    approveLecturerUpdate: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-lecturer-update", data),
    rejectLecturerUpdate: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-lecturer-update", data),

    updateLecturer: (data: Lecturer) =>
      fetch.post("/api/v1/admin/update-lecturer", data),

    // Institution

    approveInstitution: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-institution", data),
    rejectInstitution: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-institution", data),
    approveInstitutionUpdate: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-institution-update", data),
    rejectInstitutionUpdate: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-institution-update", data),

    updateInstitution: (data: Institution) =>
      fetch.post("/api/v1/admin/update-institution", data),
    // Partner

    approvePartner: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-partner", data),
    rejectPartner: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-partner", data),
    approvePartnerUpdate: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-partner-update", data),
    rejectPartnerUpdate: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-partner-update", data),

    updatePartner: (data: Partner) =>
      fetch.post("/api/v1/admin/update-partner", data),
    // Degree

    approveDegree: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-degree", data),
    rejectDegree: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-degree", data),
    approveDegreeUpdate: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-degree-update", data),
    rejectDegreeUpdate: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-degree-update", data),

    // Certification
    approveCertification: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-certification", data),
    rejectCertification: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-certification", data),
    approveCertificationUpdate: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-certification-update", data),
    rejectCertificationUpdate: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-certification-update", data),

    // Attended Courses
    approveAttendedCourse: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-attended-course", data),
    rejectAttendedCourse: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-attended-course", data),
    approveAttendedCourseUpdate: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-attended-course-update", data),
    rejectAttendedCourseUpdate: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-attended-course-update", data),

    // Owned Courses
    approveOwnedCourse: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-owned-course", data),
    rejectOwnedCourse: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-owned-course", data),
    approveOwnedCourseUpdate: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-owned-course-update", data),
    rejectOwnedCourseUpdate: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-owned-course-update", data),

    // Research Projects
    approveResearchProject: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-research-project", data),
    rejectResearchProject: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-research-project", data),
    approveResearchProjectUpdate: (data: IdRequest) =>
      fetch.post("/api/v1/admin/approve-research-project-update", data),
    rejectResearchProjectUpdate: (data: RejectRequest) =>
      fetch.post("/api/v1/admin/reject-research-project-update", data),

    // Course
    getAllCourses: () => fetch.get("/api/v1/admin/get-all-courses"),
    getCourseById: (id: number) => fetch.get(`/api/v1/admin/get-course/${id}`),
    updateCourseMember: (data: any) =>
      fetch.post("/api/v1/admin/update-course-member", data),
    getOwnedCourses: () =>
      fetch.get("/api/v1/admin/get-new-owned-courses"),
    createCourse: (data: any) =>
      fetch.post("/api/v1/admin/create-course", data),
  },

  other: {
    getLecturerProfile: (id: string) => {
      return fetch.get(`/api/v1/user/lecturer-profile/${id}`);
    },
    checkCitizenId: (citizenId: string) => {
      return fetch.get("/api/v1/user/check-citizen-id/" + citizenId);
    }
  },

};
