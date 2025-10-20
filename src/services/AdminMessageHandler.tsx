import { setInstitutionPendingCreate } from "../redux/slice/InstitutionPendingCreateSlice";
import { setInstitutionPendingUpdate } from "../redux/slice/InstitutionPendingUpdateSlice";
import { setInstitutions } from "../redux/slice/InstitutionSlice";
import { setLecturerPendingCreate } from "../redux/slice/LecturerPendingCreateSlice";
import { setLecturerPendingUpdate } from "../redux/slice/LecturerPendingUpdateSlice";
import { setLecturerProfileUpdate } from "../redux/slice/LecturerProfileUpdateSlice";
import { setLecturers } from "../redux/slice/LecturerSlice";
import { setPartnerPendingCreate } from "../redux/slice/PartnerPendingCreateSlice";
import { setPartnerPendingUpdate } from "../redux/slice/PartnerPendingUpdateSlice";
import { setPartner } from "../redux/slice/PartnerSlice";
import { setAttendedCourseRequests } from "../redux/slice/RequestAttendedCourseSlice";
import { setCertificationRequests } from "../redux/slice/RequestCertificationSlice";
import { setDegreeRequests } from "../redux/slice/RequestDegreeSlice";
import { setOwnedCourseRequests } from "../redux/slice/RequestOwnedCourseSlice";
import { setResearchProjectRequests } from "../redux/slice/RequestResearchProjectSlice";
import { API } from "../utils/Fetch";

export const AdminMessageHandler = {
  handleIncomingMessage: async (message: any, dispatch: any) => {
    try {
      const parsedMessage =
        typeof message === "string" ? JSON.parse(message) : message;
      console.log("🔍 Message type:", parsedMessage.type);

      switch (parsedMessage.type) {
        ///LECTURER
        case "EDIT_LECTURER":
          const resEL = await API.admin.getLecturerPendingUpdate();
          dispatch(setLecturerPendingUpdate(resEL.data.data));
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "CREATE_LECTURER":
          await handleLecturerCreate(dispatch);
          break;
        case "UPDATE_LECTURER":
          await handleLecturerCreate(dispatch);
          break;
        /// DEGREE
        case "UPDATE_DEGREE":
          await handleDegreeRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "CREATE_DEGREE":
          await handleDegreeRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "EDIT_DEGREE":
          await handleDegreeRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "DELETE_DEGREE":
          await handleDegreeRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        /// CERTIFICATION
        case "UPDATE_CERTIFICATION":
          await handleCertificationRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "CREATE_CERTIFICATION":
          await handleCertificationRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "EDIT_CERTIFICATION":
          await handleCertificationRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "DELETE_CERTIFICATION":
          await handleCertificationRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        /// OWNED COURSE
        case "UPDATE_OWNED_COURSE":
          await handleOwnedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "CREATE_OWNED_COURSE":
          await handleOwnedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "EDIT_OWNED_COURSE":
          await handleOwnedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "DELETE_OWNED_COURSE":
          await handleOwnedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        /// ATTENDED COURSES
        case "UPDATE_ATTENDED_COURSE":
          await handleAttendedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "CREATE_ATTENDED_COURSE":
          await handleAttendedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "EDIT_ATTENDED_COURSE":
          await handleAttendedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "DELETE_ATTENDED_COURSE":
          await handleAttendedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        // RESEARCH PROJECT
        case "UPDATE_RESEARCH_PROJECT":
          await handleResearchProjectRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        case "CREATE_RESEARCH_PROJECT":
          await handleResearchProjectRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        case "EDIT_RESEARCH_PROJECT":
          await handleResearchProjectRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        case "DELETE_RESEARCH_PROJECT":
          await handleResearchProjectRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        default:
          console.log("⚠️ Unknown message type:", parsedMessage.type);
          break;
        /// INSTITUTION
        case "UPDATE_INSTITUTION":
          console.log("🏢 Handling institution update:", parsedMessage.content);
          await handleInstitutionCreate(dispatch);
          break;

        case "CREATE_INSTITUTION":
          console.log(
            "🏢 Handling institution creation:",
            parsedMessage.content,
          );
          await handleInstitutionCreate(dispatch);

          break;

        case "EDIT_INSTITUTION":
          console.log(
            "🏢 Handling institution editing:",
            parsedMessage.content,
          );
          await handleInstitutionUpdate(dispatch);

          break;

        case "DELETE_INSTITUTION":
          console.log(
            "🏢 Handling institution deletion:",
            parsedMessage.content,
          );
          break;

        /// PARTNER
        case "UPDATE_PARTNER":
          console.log("🤝 Handling partner update:", parsedMessage.content);
          await handlePartnerCreate(dispatch);
          break;

        case "CREATE_PARTNER":
          console.log("🤝 Handling partner creation:", parsedMessage.content);
          await handlePartnerCreate(dispatch);
          break;

        case "EDIT_PARTNER":
          console.log("🤝 Handling partner editing:", parsedMessage.content);
          await handlePartnerUpdate(dispatch);

          break;

        case "DELETE_PARTNER":
          console.log("🤝 Handling partner deletion:", parsedMessage.content);

          break;
      }
    } catch (error) {
      console.error("❌ Error parsing message:", error);
    }
  },
};

const handleDegreeRequests = async (dispatch: any) => {
  const response = await API.admin.getDegreeRequests();
  dispatch(setDegreeRequests(response.data.data));
};

const handleCertificationRequests = async (dispatch: any) => {
  const response = await API.admin.getCertificationRequests();
  dispatch(setCertificationRequests(response.data.data));
};

const handleAttendedCourseRequests = async (dispatch: any) => {
  const response = await API.admin.getAttendedCourseRequests();
  dispatch(setAttendedCourseRequests(response.data.data));
};

const handleOwnedCourseRequests = async (dispatch: any) => {
  const response = await API.admin.getOwnedCourseRequests();
  dispatch(setOwnedCourseRequests(response.data.data));
};

const handleResearchProjectRequests = async (dispatch: any) => {
  const response = await API.admin.getResearchProjectRequests();
  dispatch(setResearchProjectRequests(response.data.data));
};

const handleLecturerProfileUpdate = async (
  dispatch: any,
  lecturerId: string,
) => {
  const res = await API.admin.getLecturerPendingUpdate();
  dispatch(setLecturerPendingUpdate(res.data.data));
  const response = await API.admin.getLecturerAllProfile({ id: lecturerId });
  dispatch(setLecturerProfileUpdate(response.data.data));
};

const handleLecturerCreate = async (dispatch: any) => {
  const res = await API.admin.getLecturerPendingCreate();
  dispatch(setLecturerPendingCreate(res.data.data));
  const response = await API.admin.getAllLecturers();
  dispatch(setLecturers(response.data.data));
};

const handleInstitutionCreate = async (dispatch: any) => {
  const res = await API.admin.getInstitutionPendingCreate();
  dispatch(setInstitutionPendingCreate(res.data.data));
  const response = await API.admin.getAllInstitutions();
  dispatch(setInstitutions(response.data.data));
};

const handlePartnerCreate = async (dispatch: any) => {
  const res = await API.admin.getPartnerPendingCreate();
  dispatch(setPartnerPendingCreate(res.data.data));
  const response = await API.admin.getAllPartners();
  dispatch(setPartner(response.data.data));
};
const handlePartnerUpdate = async (dispatch: any) => {
  const res = await API.admin.getPartnerPendingUpdate();
  dispatch(setPartnerPendingUpdate(res.data.data));
  const response = await API.admin.getAllPartners();
  dispatch(setPartner(response.data.data));
}

const handleInstitutionUpdate = async (dispatch: any) => {
  const res = await API.admin.getInstitutionPendingUpdate();
  dispatch(setInstitutionPendingUpdate(res.data.data));
  const response = await API.admin.getAllInstitutions();
  dispatch(setInstitutions(response.data.data));
};
