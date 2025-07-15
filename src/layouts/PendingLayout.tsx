import { Outlet } from "react-router-dom"

const PendingLayout = () => {
    return (
        <div>
            <div>
                Pending Header
            </div>
            <div>
                <Outlet />
            </div>
            <div>
                Pending Footer
            </div>
        </div>
    )
}

export default PendingLayout