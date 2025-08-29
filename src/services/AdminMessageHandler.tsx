import { setLecturerPendingUpdate } from "../redux/slice/LecturerPendingUpdateSlice";
import { setLecturerProfileUpdate } from "../redux/slice/LecturerProfileUpdateSlice";
import { setAttendedCourseRequests } from "../redux/slice/RequestAttendedCourseSlice";
import { setCertificationRequests } from "../redux/slice/RequestCertificationSlice";
import { setDegreeRequests } from "../redux/slice/RequestDegreeSlice";
import { setOwnedCourseRequests } from "../redux/slice/RequestOwnedCourseSlice";
import { setResearchProjectRequests } from "../redux/slice/RequestResearchProjectSlice";
import { API } from "../utils/Fetch";

export const AdminMessageHandler = {
  handleIncomingMessage: async (message: any, dispatch: any) => {
    console.log("📨 Admin received message:", message);
    try {
      const parsedMessage =
        typeof message === "string" ? JSON.parse(message) : message;
      console.log("🔍 Message type:", parsedMessage.type);

      switch (parsedMessage.type) {
        /// DEGREE
        case "UPDATE_DEGREE":
          console.log("🎓 Handling degree update:", parsedMessage.content);
          await handleDegreeRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "CREATE_DEGREE":
          console.log("🎓 Handling degree creation:", parsedMessage.content.id);
          await handleDegreeRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "EDIT_DEGREE":
          console.log("🎓 Handling degree editing:", parsedMessage.content);
          await handleDegreeRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "DELETE_DEGREE":
          console.log("🎓 Handling degree deletion:", parsedMessage.content);
          await handleDegreeRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        /// CERTIFICATION
        case "UPDATE_CERTIFICATION":
          console.log("🎓 Handling certificate update:", parsedMessage.content);
          await handleCertificationRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "CREATE_CERTIFICATION":
          console.log(
            "🎓 Handling certificate creation:",
            parsedMessage.content,
          );
          await handleCertificationRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "EDIT_CERTIFICATION":
          console.log(
            "🎓 Handling certificate editing:",
            parsedMessage.content,
          );
          await handleCertificationRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "DELETE_CERTIFICATION":
          console.log(
            "🎓 Handling certificate deletion:",
            parsedMessage.content,
          );
          await handleCertificationRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        /// OWNED COURSE
        case "UPDATE_OWNED_COURSE":
          console.log(
            "🎓 Handling owned course update:",
            parsedMessage.content,
          );
          await handleOwnedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "CREATE_OWNED_COURSE":
          console.log(
            "🎓 Handling owned course creation:",
            parsedMessage.content,
          );
          await handleOwnedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "EDIT_OWNED_COURSE":
          console.log(
            "🎓 Handling owned course editing:",
            parsedMessage.content,
          );
          await handleOwnedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "DELETE_OWNED_COURSE":
          console.log(
            "🎓 Handling owned course deletion:",
            parsedMessage.content,
          );
          await handleOwnedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        /// ATTENDED COURSES
        case "UPDATE_ATTENDED_COURSE":
          console.log(
            "🎓 Handling attended course update:",
            parsedMessage.content,
          );
          await handleAttendedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "CREATE_ATTENDED_COURSE":
          console.log(
            "🎓 Handling attended course creation:",
            parsedMessage.content,
          );
          await handleAttendedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "EDIT_ATTENDED_COURSE":
          console.log(
            "🎓 Handling attended course editing:",
            parsedMessage.content,
          );
          await handleAttendedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        case "DELETE_ATTENDED_COURSE":
          console.log(
            "🎓 Handling attended course deletion:",
            parsedMessage.content,
          );
          await handleAttendedCourseRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        // RESEARCH PROJECT
        case "UPDATE_RESEARCH_PROJECT":
          console.log(
            "📊 Handling research project update:",
            parsedMessage.content,
          );
          await handleResearchProjectRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        case "CREATE_RESEARCH_PROJECT":
          console.log(
            "📊 Handling research project creation:",
            parsedMessage.content,
          );
          await handleResearchProjectRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        case "EDIT_RESEARCH_PROJECT":
          console.log(
            "📊 Handling research project editing:",
            parsedMessage.content,
          );
          await handleResearchProjectRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        case "DELETE_RESEARCH_PROJECT":
          console.log(
            "📊 Handling research project deletion:",
            parsedMessage.content,
          );
          await handleResearchProjectRequests(dispatch);
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;

        case "EDIT_LECTURER":
          console.log("👨‍🏫 Handling lecturer editing:", parsedMessage.content);
          const resEL = await API.admin.getLecturerPendingUpdate();
          dispatch(setLecturerPendingUpdate(resEL.data.data));
          await handleLecturerProfileUpdate(dispatch, parsedMessage.content.id);
          break;
        default:
          console.log("⚠️ Unknown message type:", parsedMessage.type);
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
  const response = await API.admin.getLecturerAllProfile({ id: lecturerId });
  dispatch(setLecturerProfileUpdate(response.data.data));
};
