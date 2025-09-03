import { setPendingInstitution } from "../redux/slice/PendingInstitutionSlice";
import { setPendingLecturer } from "../redux/slice/PendingLectuererSlice";
import { setPendingPartner } from "../redux/slice/PendingPartnerSlice";
import { setUserProfile } from "../redux/slice/userSlice";
import { API } from "../utils/Fetch";

export const UserMessageHandler = {
  handleIncomingMessage: (message: any, dispatch: any) => {
    // Xử lý tin nhắn đến từ WebSocket
    try {
      const parsedMessage =
        typeof message === "string" ? JSON.parse(message) : message;
      console.log("🔍 Message type:", parsedMessage.type);

      switch (parsedMessage.type) {
        ///LECTURER
        case "APPROVE_LECTURER":
          handleApproveLecturer(dispatch);
          break;
        case "REJECT_LECTURER":
          handleRejectLecturer(dispatch);
          break;
        case "APPROVE_INSTITUTION":
          handleApproveInstitution(dispatch);
          break;
        case "REJECT_INSTITUTION":
          handleRejectInstitution(dispatch);
          break;
        case "APPROVE_PARTNER":
          handleApprovePartner(dispatch);
          break;
        case "REJECT_PARTNER":
          handleRejectPartner(dispatch);
          break;
      }
    } catch (error) {
      console.error("❌ Error parsing message:", error);
    }
  },
};

const handleApproveLecturer = async (dispatch: any) => {
  try {
    const response = await API.user.getUserProfile();
    dispatch(setUserProfile(response.data.data));
    window.location.reload();
  } catch (error) {
    console.error("❌ Error approving lecturer:", error);
  }
};

const handleRejectLecturer = async (dispatch: any) => {
  const res = await API.user.getUserProfile();
  dispatch(setUserProfile(res.data.data));
  const response = await API.user.getPendingLecturer();
  dispatch(setPendingLecturer(response.data.data));
  window.location.reload();
};

const handleApproveInstitution = async (_dispatch: any) => {
  try {
    window.location.reload();
  } catch (error) {
    console.error("❌ Error approving institution:", error);
  }
};

const handleRejectInstitution = async (dispatch: any) => {
  const res = await API.user.getUserProfile();
  dispatch(setUserProfile(res.data.data));
  const response = await API.user.getPendingInstitution();
  dispatch(setPendingInstitution(response.data.data));
  // window.location.reload();
};

const handleApprovePartner = async (_dispatch: any) => {
  try {
    window.location.reload();
  } catch (error) {
    console.error("❌ Error approving partner:", error);
  }
};

const handleRejectPartner = async (dispatch: any) => {
  const res = await API.user.getUserProfile();
  dispatch(setUserProfile(res.data.data));
  const response = await API.user.getPendingPartner();
  dispatch(setPendingPartner(response.data.data));
  // window.location.reload();
};
