import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import type { UserProfile } from "../types/UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../utils/Fetch";
import { setUserProfile } from "../redux/slice/userSlice";

const HomeLayout = () => {
    const userProfile = useSelector((state: { userProfile: UserProfile | null }) => state.userProfile);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isEmptyUser = !userProfile || Object.keys(userProfile).length === 0;
    useEffect(() => {
        if (isEmptyUser) {
            const fetchUserProfile = async () => {
                try {
                    const response = await API.user.getUserProfile();
                    const user = response?.data.data;
                    if (user && user.role) {
                        dispatch(setUserProfile(user));
                        redirectBasedOnRole(user)
                    } else {
                        console.warn("Invalid user profile:", user);
                    }
                } catch (err) {
                    console.error("Error fetching user:", err);
                }
            };
            fetchUserProfile();
        }
    }, [dispatch, navigate, userProfile])


    const redirectBasedOnRole = (user: UserProfile) => {
        const roleRedirects: Record<UserProfile["role"], string> = {
            LECTURER: "/lecturer",
            SCHOOL: "/institution",
            ORGANIZATION: "/partner",
            ADMIN: "/admin",
            USER: "",
        };
        console.log("User role:", user.role);

        const redirect = roleRedirects[user.role];
        if (redirect) {
            navigate(redirect);
            return;
        }
        if (user.role === "USER") {
            console.log("Redirecting user:", user);
            if (user.lecturer != null && user.educationInstitution == null && user.partnerOrganization == null) {
                navigate("/pending-lecturer")
            }
            else if (user.lecturer == null && user.educationInstitution != null && user.partnerOrganization == null) {
                navigate("/pending-institution")
            }
            else if (user.lecturer == null && user.educationInstitution == null && user.partnerOrganization != null) {
                navigate("/pending-partner")
            }
        }

    }
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row w-full px-5 py-5 bg-blue-200">
                Home Header
            </div>
            <div className="">
                <Outlet />
            </div>
            <div className="flex flex-row w-full px-5 py-5 bg-blue-200">
                Home Footer
            </div>

        </div>
    )
}

export default HomeLayout