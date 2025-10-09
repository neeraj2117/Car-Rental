import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/navbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const {isOwner, navigate} = useAppContext();


  useEffect(() => {
    if (!isOwner) {
      navigate('/');
    }
  }, [isOwner])
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarOwner />
      <div className="flex flex-1">
        <Sidebar className="bg-white" />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
