import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
const BlankLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             const response = await API.user.getUserProfile();
    //             dispatch(setUserProfile(response.data.data));
    //             if (response.data.data) {
    //                 navigateToRole(response.data.data, navigate);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching user data:", error);
    //         }
    //     };
    //     fetchUserData();
    // }, []);
    return (
        <div>
            <div>
                
            </div>
            <div>
                <Outlet />
            </div>
            <div>
                
            </div>

        </div>
    )
}

export default BlankLayout