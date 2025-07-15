import { Outlet } from "react-router-dom"

const PartnerLayout = () => {
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