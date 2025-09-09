import { setPartnerProfile } from "../redux/slice/PartnerProfileSlice";
import { API } from "../utils/Fetch";

export const PartnerMessageHandler = {
  handleIncomingMessage: async (message: any, dispatch: any) => {
    console.log("📨 Partner received message:", message);
    try {
      const parsedMessage =
        typeof message === "string" ? JSON.parse(message) : message;
      console.log("🔍 Message type:", parsedMessage.type);
      switch (parsedMessage.type) {
        case "APPROVE_PARTNER":
          console.log("🏢 Handling partner approval:", parsedMessage.content);
          handleRefreshPartnerProfile(dispatch);
          break;
        case "REJECT_PARTNER":
          console.log("🏢 Handling partner rejection:", parsedMessage.content);
          handleRefreshPartnerProfile(dispatch);
          break;
        case "APPROVE_PARTNER_UPDATE":
          console.log(
            "🏢 Handling partner update approval:",
            parsedMessage.content,
          );
          handleRefreshPartnerProfile(dispatch);
          break;
        case "REJECT_PARTNER_UPDATE":
          console.log(
            "🏢 Handling partner update rejection:",
            parsedMessage.content,
          );
          handleRefreshPartnerProfile(dispatch);
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

const handleRefreshPartnerProfile = async (dispatch: any) => {
  try {
    const response = await API.partner.getPartnerProfile();
    dispatch(setPartnerProfile(response.data.data));
  } catch (error) {
    console.error("Error refreshing partner profile:", error);
  }
};
