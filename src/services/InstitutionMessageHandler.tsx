import { setInstitutionProfile } from "../redux/slice/InstitutionProfileSlice";
import { API } from "../utils/Fetch";

export const InstitutionMessageHandler = {
  handleIncomingMessage: async (message: any, dispatch: any) => {
    console.log("📨 Institution received message:", message);
    try {
      const parsedMessage =
        typeof message === "string" ? JSON.parse(message) : message;
      console.log("🔍 Message type:", parsedMessage.type);
      switch (parsedMessage.type) {
        case "APPROVE_INSTITUTION":
          console.log(
            "🏢 Handling institution approval:",
            parsedMessage.content,
          );
          handleRefeshInstitutionProfile(dispatch);
          break;
        case "REJECT_INSTITUTION":
          console.log(
            "🏢 Handling institution rejection:",
            parsedMessage.content,
          );
          handleRefeshInstitutionProfile(dispatch);
          break;
        case "APPROVE_INSTITUTION_UPDATE":
          console.log(
            "🏢 Handling institution update approval:",
            parsedMessage.content,
          );
          handleRefeshInstitutionProfile(dispatch);
          break;
        case "REJECT_INSTITUTION_UPDATE":
          console.log(
            "🏢 Handling institution update rejection:",
            parsedMessage.content,
          );
          handleRefeshInstitutionProfile(dispatch);
          break;
        default:
          console.warn("⚠️ Unhandled message type:", parsedMessage.type);
          break;
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      return;
    }
  },
};

const handleRefeshInstitutionProfile = async (dispatch: any) => {
  try {
    const response = await API.institution.getInstitutionProfile();
    dispatch(setInstitutionProfile(response.data.data));
  } catch (error) {
    console.error("Error refreshing institution profile:", error);
  }
};
