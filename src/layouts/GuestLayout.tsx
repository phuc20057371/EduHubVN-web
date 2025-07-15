import { Outlet } from "react-router-dom"

const GuestLayout = () => {
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