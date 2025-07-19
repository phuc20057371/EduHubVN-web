import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom"
import { API } from "../utils/Fetch";
import { setUserProfile } from "../redux/slice/userSlice";
import { navigateToRole } from "../utils/navigationRole";

const PartnerLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.user.getUserProfile();
                dispatch(setUserProfile(response.data.data));
                if (response.data.data) {
                    navigateToRole(response.data.data, navigate);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);
    return (
        <div>
            <div>
                Institution Header
            </div>
            <div>
                <Outlet />
            </div>
            <div>
                Institution Footer
            </div>
        </div>
    )
}

export default PartnerLayout