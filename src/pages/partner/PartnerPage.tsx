import React, { useEffect, useState } from "react";
import { API } from "../../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../../redux/slice/userSlice";
import type { UserProfile } from "../../types/UserProfile";
import { useWebSocket } from "../../hooks/useWebSocket";

const PartnerPage: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const userProfile = useSelector(
    (state: { userProfile: UserProfile }) => state.userProfile,
  );

  // Sử dụng custom hook cho WebSocket
  const { sendMessage: sendWSMessage } = useWebSocket({
    onConnected: () => console.log("PartnerPage WebSocket connected"),
    onMessage: (msg: string) => setMessages((prev) => [...prev, msg]),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userProfile) return;
        const response = await API.user.getUserProfile();
        dispatch(setUserProfile(response.data.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [dispatch, userProfile]);

  const sendMessage = () => {
    sendWSMessage("/app/hello", input);
    setInput("");
  };

  return (
    <div>
      <h2>Partner Page</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
};

export default PartnerPage;
