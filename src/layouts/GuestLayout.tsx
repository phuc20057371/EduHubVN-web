import { Outlet } from "react-router-dom";

const GuestLayout = () => {
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
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
                Guest Header
            </div>
            <div>
                <Outlet />
            </div>
            <div>
                Guest Footer
            </div>

        </div>
    )
}

export default GuestLayout