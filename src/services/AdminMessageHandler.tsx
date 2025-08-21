import { setLecturerPendingUpdate } from "../redux/slice/LecturerPendingUpdateSlice";
import { setLecturerRequests } from "../redux/slice/LecturerRquestSlice";
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
          await handleLecturerRequests(dispatch);
          break;
        case "CREATE_DEGREE":
          console.log("🎓 Handling degree creation:", parsedMessage.content);
          await handleLecturerRequests(dispatch);
          break;
        case "EDIT_DEGREE":
          console.log("🎓 Handling degree editing:", parsedMessage.content);
          await handleLecturerRequests(dispatch);
          break;
        case "DELETE_DEGREE":
          console.log("🎓 Handling degree deletion:", parsedMessage.content);
          await handleLecturerRequests(dispatch);
          break;
        /// CERTIFICATION
        case "UPDATE_CERTIFICATION":
          console.log("🎓 Handling certificate update:", parsedMessage.content);
          await handleLecturerRequests(dispatch);
          break;
        case "CREATE_CERTIFICATION":
          console.log(
            "🎓 Handling certificate creation:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;
        case "EDIT_CERTIFICATION":
          console.log(
            "🎓 Handling certificate editing:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;
        case "DELETE_CERTIFICATION":
          console.log(
            "🎓 Handling certificate deletion:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;
        /// OWNED COURSE
        case "UPDATE_OWNED_COURSE":
          console.log(
            "🎓 Handling owned course update:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;
        case "CREATE_OWNED_COURSE":
          console.log(
            "🎓 Handling owned course creation:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;
        case "EDIT_OWNED_COURSE":
          console.log(
            "🎓 Handling owned course editing:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;
        case "DELETE_OWNED_COURSE":
          console.log(
            "🎓 Handling owned course deletion:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;

        /// ATTENDED COURSES
        case "UPDATE_ATTENDED_COURSE":
          console.log(
            "🎓 Handling attended course update:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;
        case "CREATE_ATTENDED_COURSE":
          console.log(
            "🎓 Handling attended course creation:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;
        case "EDIT_ATTENDED_COURSE":
          console.log(
            "🎓 Handling attended course editing:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;
        case "DELETE_ATTENDED_COURSE":
          console.log(
            "🎓 Handling attended course deletion:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;

        // RESEARCH PROJECT
        case "UPDATE_RESEARCH_PROJECT":
          console.log(
            "📊 Handling research project update:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;

        case "CREATE_RESEARCH_PROJECT":
          console.log(
            "📊 Handling research project creation:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;

        case "EDIT_RESEARCH_PROJECT":
          console.log(
            "📊 Handling research project editing:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;

        case "DELETE_RESEARCH_PROJECT":
          console.log(
            "📊 Handling research project deletion:",
            parsedMessage.content,
          );
          await handleLecturerRequests(dispatch);
          break;

        case "EDIT_LECTURER":
          console.log("👨‍🏫 Handling lecturer editing:", parsedMessage.content);
          const resEL = await API.admin.getLecturerPendingUpdate();
          dispatch(setLecturerPendingUpdate(resEL.data.data));
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

const handleLecturerRequests = async (dispatch: any) => {
  const response = await API.admin.getLecturerRequests();
  dispatch(setLecturerRequests(response.data.data));
};
