import { setLecturerProfile } from "../redux/slice/LecturerProfileSlice";
import { API } from "../utils/Fetch";

export const LecturerMessageHandler = {
  handleIncomingMessage: async (message: any, dispatch: any) => {
    console.log("📨 Lecturer received message:", message);
    try {
      const parsedMessage =
        typeof message === "string" ? JSON.parse(message) : message;
      console.log("🔍 Message type:", parsedMessage.type);

      switch (parsedMessage.type) {
        /// Degree
        case "APPROVE_DEGREE":
          console.log("🎓 Handling degree approval:", parsedMessage.content);
          await handleLecturerProfile(dispatch);
          break;
        case "APPROVE_DEGREE_UPDATE":
          console.log(
            "🎓 Handling degree approval update:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "REJECT_DEGREE":
          console.log("🎓 Handling degree rejection:", parsedMessage.content);
          await handleLecturerProfile(dispatch);
          break;
        case "REJECT_DEGREE_UPDATE":
          console.log(
            "🎓 Handling degree rejection update:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        /// Certification
        case "APPROVE_CERTIFICATION":
          console.log(
            "🎓 Handling CERTIFICATION approval:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "APPROVE_CERTIFICATION_UPDATE":
          console.log(
            "🎓 Handling CERTIFICATION approval update:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "REJECT_CERTIFICATION":
          console.log(
            "🎓 Handling CERTIFICATION rejection:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "REJECT_CERTIFICATION_UPDATE":
          console.log(
            "🎓 Handling CERTIFICATION rejection update:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        /// Owned Courses
        case "APPROVE_OWNED_COURSE":
          console.log(
            "🎓 Handling OWNED COURSE approval:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "APPROVE_OWNED_COURSE_UPDATE":
          console.log(
            "🎓 Handling OWNED COURSE approval update:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "REJECT_OWNED_COURSE":
          console.log(
            "🎓 Handling OWNED COURSE rejection:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "REJECT_OWNED_COURSE_UPDATE":
          console.log(
            "🎓 Handling OWNED COURSE rejection update:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;

        /// Attended Courses
        case "APPROVE_ATTENDED_COURSE":
          console.log(
            "🎓 Handling ATTENDED COURSE approval:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "APPROVE_ATTENDED_COURSE_UPDATE":
          console.log(
            "🎓 Handling ATTENDED COURSE approval update:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "REJECT_ATTENDED_COURSE":
          console.log(
            "🎓 Handling ATTENDED COURSE rejection:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "REJECT_ATTENDED_COURSE_UPDATE":
          console.log(
            "🎓 Handling ATTENDED COURSE rejection update:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        /// RESEARCH PROJECTS
        case "APPROVE_RESEARCH_PROJECT":
          console.log(
            "📊 Handling RESEARCH PROJECT approval:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "APPROVE_RESEARCH_PROJECT_UPDATE":
          console.log(
            "📊 Handling RESEARCH PROJECT approval update:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "REJECT_RESEARCH_PROJECT":
          console.log(
            "📊 Handling RESEARCH PROJECT rejection:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
          break;
        case "REJECT_RESEARCH_PROJECT_UPDATE":
          console.log(
            "📊 Handling RESEARCH PROJECT rejection update:",
            parsedMessage.content,
          );
          await handleLecturerProfile(dispatch);
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

const handleLecturerProfile = async (dispatch: any) => {
  const response = await API.lecturer.getLecturerProfile();
  dispatch(setLecturerProfile(response.data.data));
};
