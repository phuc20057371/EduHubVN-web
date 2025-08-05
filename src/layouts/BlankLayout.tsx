import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { API } from "../utils/Fetch";
import { setUserProfile } from "../redux/slice/userSlice";
const BlankLayout = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state: any) => state.user);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userProfile || userProfile.id === null) {
          const response = await API.user.getUserProfile();
          dispatch(setUserProfile(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);
  return (
    <div>
      <div></div>
      <div>
        <Outlet />
      </div>
      <div></div>
    </div>
  );
};

export default BlankLayout;
