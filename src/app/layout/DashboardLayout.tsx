import { Outlet } from 'react-router'
import Sidebar from '../../shared/components/Sidebar'
import Footer from '../../shared/components/Footer'
import { useEffect } from 'react'
import { getProfile } from '../features/profile/useCases/getProfile'

const DashboardLayout = () => {
  useEffect(() => {
    getProfile()
  }, [])

  return (
    <div className="w-full h-screen flex flex-col ">
      <div className="w-full h-full flex">
        <Sidebar />
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default DashboardLayout
