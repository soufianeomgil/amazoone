import AdminHeader from '@/components/shared/AdminHeader'
import React from 'react'

const AdminLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <AdminHeader />
         {children}
    </div>
  )
}

export default AdminLayout