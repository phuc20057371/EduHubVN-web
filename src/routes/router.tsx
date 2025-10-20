import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import BlankLayout from "../layouts/BlankLayout";
// import ProtectedRoute from '../utils/ProtectedRoute';
import AdminLayout from "../layouts/AdminLayout";
import GuestLayout from "../layouts/GuestLayout";
import HomeLayout from "../layouts/HomeLayout";
import InstitutionLayout from "../layouts/InstitutionLayout";
import LecturerLayout from "../layouts/LecturerLayout";
import PartnerLayout from "../layouts/PartnerLayout";
import PendingLayout from "../layouts/PendingLayout";
import AdminCourse from "../pages/admin/AdminCourse";
import AdminInstitutionPage from "../pages/admin/AdminInstitutionPage";
import AdminLecturerPage from "../pages/admin/AdminLecturerPage";
import AdminPage from "../pages/admin/AdminPage";
import AdminPartner from "../pages/admin/AdminPartnerPage";
import SubAdminPage from "../pages/admin/SubAdminPage";
import GuestPage from "../pages/guest/GuestPage";
import InstitutionPendingPage from "../pages/guest/InstitutionPendingPage";
import LecturerPendingPage from "../pages/guest/LecturerPendingPage";
import PartnerPendingPage from "../pages/guest/PartnerPendingPage";
import HomePage from "../pages/home/HomePage";
import InstitutionContractPage from "../pages/institution/InstitutionContractPage";
import InstitutionCourse from "../pages/institution/InstitutionCourse";
import InstitutionLecturerPage from "../pages/institution/InstitutionLecturerPage";
import InstitutionPage from "../pages/institution/InstitutionPage";
import InstitutionProfilePage from "../pages/institution/InstitutionProfilePage";
import InstitutionProjectPage from "../pages/institution/InstitutionProjectPage";
import LecturerContractPage from "../pages/lecturer/LecturerContractPage";
import LecturerCoursePage from "../pages/lecturer/LecturerCoursePage";
import LecturerPage from "../pages/lecturer/LecturerPage";
import LecturerProfilePage from "../pages/lecturer/LecturerProfilePage";
import LecturerProjectPage from "../pages/lecturer/LecturerProjectPage";
import LecturerStatisticPage from "../pages/lecturer/LecturerStatisticPage";
import ForgotPassword from "../pages/login/ForgotPassword";
import Login from "../pages/login/Login";
import LecturerInfoPage from "../pages/other/LecturerInfoPage";
import PartnerContractPage from "../pages/partner/PartnerContractPage";
import PartnerCoursePage from "../pages/partner/PartnerCoursePage";
import PartnerLecturerPage from "../pages/partner/PartnerLecturerPage";
import PartnerPage from "../pages/partner/PartnerPage";
import PartnerProfilePage from "../pages/partner/PartnerProfilePage";
import PartnerProjectPage from "../pages/partner/PartnerProjectPage";
import Register from "../pages/register/Register";
import RegisterInstitution from "../pages/register/RegisterInstitution";
import RegisterLecturer from "../pages/register/RegisterLecturer";
import RegisterPartner from "../pages/register/RegisterPartner";
import AdminOnlyRoute from "../utils/AdminOnlyRoute";
import ProtectedRoute from "../utils/ProtectedRoute";
import AccountConfigLecturer from "../pages/lecturer/AccountConfigLecturer";
import AccountConfigInstitution from "../pages/institution/AccountConfigInstitution";
import AccountConfigPartner from "../pages/partner/AccountConfigPartner";
import AdminTrainingProgram from "../pages/admin/AdminTrainingProgram";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<HomeLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Route>

      <Route element={<GuestLayout />}>
        <Route path="/guest" element={<GuestPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<PendingLayout />}>
          <Route path="/pending-lecturer" element={<LecturerPendingPage />} />
          <Route
            path="/pending-institution"
            element={<InstitutionPendingPage />}
          />
          <Route path="/pending-partner" element={<PartnerPendingPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/lecturers" element={<AdminLecturerPage />} />
          <Route
            path="/admin/institutions"
            element={<AdminInstitutionPage />}
          />
          <Route path="/admin/partners" element={<AdminPartner />} />
          <Route path="/admin/courses" element={<AdminCourse />} />
          <Route path="/admin/training-programs" element={<AdminTrainingProgram />} />
          
          {/* Protected route for ADMIN role only */}
          <Route element={<AdminOnlyRoute />}>
            <Route path="/admin/sub-admin" element={<SubAdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<LecturerLayout />}>
          <Route path="/lecturer" element={<LecturerPage />} />
          <Route path="/lecturer/profile" element={<LecturerProfilePage />} />
          <Route
            path="/lecturer/contracts"
            element={<LecturerContractPage />}
          />
          <Route path="/lecturer/courses" element={<LecturerCoursePage />} />
          <Route
            path="/lecturer/statistics"
            element={<LecturerStatisticPage />}
          />
          <Route path="/lecturer/projects" element={<LecturerProjectPage />} />
          <Route path="/account-config-lecturer" element={<AccountConfigLecturer />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<InstitutionLayout />}>
          <Route path="/institution" element={<InstitutionPage />} />
          <Route
            path="/institution/profile"
            element={<InstitutionProfilePage />}
          />
          <Route
            path="/institution/contracts"
            element={<InstitutionContractPage />}
          />
          <Route path="/institution/courses" element={<InstitutionCourse />} />
          <Route
            path="/institution/lecturers"
            element={<InstitutionLecturerPage />}
          />
          <Route
            path="/institution/projects"
            element={<InstitutionProjectPage />}
          />
          <Route path="/account-config-institution" element={<AccountConfigInstitution />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<PartnerLayout />}>
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/partner/profile" element={<PartnerProfilePage />} />
          <Route path="/partner/contracts" element={<PartnerContractPage />} />
          <Route path="/partner/courses" element={<PartnerCoursePage />} />
          <Route path="/partner/lecturers" element={<PartnerLecturerPage />} />
          <Route path="/partner/projects" element={<PartnerProjectPage />} />
          <Route path="/account-config-partner" element={<AccountConfigPartner />} />
        </Route>
      </Route>

      {/* Protected Account Config Route */}
      <Route element={<ProtectedRoute />}>
        <Route element={<BlankLayout />}>
          
        </Route>
      </Route>

      {/* Auth + Register */}
      <Route element={<BlankLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-lecturer" element={<RegisterLecturer />} />
        <Route path="/register-institution" element={<RegisterInstitution />} />
        <Route path="/register-partner" element={<RegisterPartner />} />
        <Route path="/lecturer-info/:id" element={<LecturerInfoPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Route>
    </>,
  ),
);
