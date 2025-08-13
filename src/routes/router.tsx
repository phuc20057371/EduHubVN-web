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
import AdminInstitutionPage from "../pages/admin/AdminInstitutionPage";
import AdminLecturerPage from "../pages/admin/AdminLecturerPage";
import AdminPage from "../pages/admin/AdminPage";
import AdminPartner from "../pages/admin/AdminPartnerPage";
import GuestPage from "../pages/guest/GuestPage";
import InstitutionPendingPage from "../pages/guest/InstitutionPendingPage";
import LecturerPendingPage from "../pages/guest/LecturerPendingPage";
import PartnerPendingPage from "../pages/guest/PartnerPendingPage";
import HomePage from "../pages/home/HomePage";
import InstitutionPage from "../pages/institution/InstitutionPage";
import LecturerPage from "../pages/lecturer/LecturerPage";
import Login from "../pages/login/Login";
import PartnerPage from "../pages/partner/PartnerPage";
import Register from "../pages/register/Register";
import RegisterInstitution from "../pages/register/RegisterInstitution";
import RegisterLecturer from "../pages/register/RegisterLecturer";
import RegisterPartner from "../pages/register/RegisterPartner";
import ProtectedRoute from "../utils/ProtectedRoute";
import AdminDegree from "../pages/admin/AdminDegree";
import AdminCourse from "../pages/admin/AdminCourse";
import LecturerProfilePage from "../pages/lecturer/LecturerProfilePage";
import LecturerInfoPage from "../pages/other/LecturerInfoPage";

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
          <Route path="/admin/degree" element={<AdminDegree />} />
          <Route path="/admin/courses" element={<AdminCourse />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<LecturerLayout />}>
          <Route path="/lecturer" element={<LecturerPage />} />
          <Route path="/lecturer/profile" element={<LecturerProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<InstitutionLayout />}>
          <Route path="/institution" element={<InstitutionPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<PartnerLayout />}>
          <Route path="/partner" element={<PartnerPage />} />
        </Route>
      </Route>

      {/* Auth + Register */}
      <Route element={<BlankLayout />}>
        <Route path="/login" element={<Login />} />
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
