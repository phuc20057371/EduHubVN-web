import { Outlet } from "react-router-dom";
const BlankLayout = () => {
    return (
        <div>
            <div>
                -
            </div>
            <div>
               <Outlet />
            </div>
            <div>
                -
            </div>

        </div>
    )
}

export default BlankLayout