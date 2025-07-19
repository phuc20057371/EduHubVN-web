import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom"
import { API } from "../utils/Fetch";
import { setUserProfile } from "../redux/slice/userSlice";
import { navigateToRole } from "../utils/navigationRole";

const PendingLayout = () => {
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
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-yellow-100 border-b border-yellow-300">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-yellow-700">EduHubVN</span>
                    <span className="text-sm font-medium text-yellow-600">Tài khoản đang chờ duyệt</span>
                </div>
            </header>
            {/* Main Content */}
            <main className="flex flex-col items-center justify-center flex-1 py-8">
                <Outlet />
            </main>
            {/* Footer */}
            <footer className="px-6 py-3 text-sm text-center text-yellow-700 bg-yellow-100 border-t border-yellow-300">
                © {new Date().getFullYear()} EduHubVN. Vui lòng chờ quản trị viên duyệt tài khoản của bạn.
            </footer>
        </div>
    )
}

export default PendingLayout