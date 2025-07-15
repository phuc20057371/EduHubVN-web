import { Outlet } from "react-router-dom"

const LecturerLayout = () => {
    return (
        <div>
            <div>
                Lecturer Header
            </div>
            <div>
                <Outlet />
            </div>
            <div>
                Lecturer Footer
            </div>
        </div>
    )
}

export default LecturerLayout