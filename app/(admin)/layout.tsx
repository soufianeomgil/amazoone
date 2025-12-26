import AdminHeader from '@/components/shared/AdminHeader'
import React from 'react'

import Sidebar from '@/components/shared/SideBar'

const AdminLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <Sidebar  />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Amazon-style Top Header */}
       <AdminHeader />

        {/* View Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
           
            
            {/* {(activeTab !== 'dashboard' && activeTab !== 'assistant') && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                <div className="text-6xl mb-4">🏗️</div>
                <h2 className="text-xl font-bold">Section Under Development</h2>
                <p>The {activeTab} analytics are currently being aggregated.</p>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-4 text-orange-600 hover:underline font-medium"
                >
                  Return to Dashboard
                </button>
              </div>
            )} */}
            {children}
          </div>
        </main>

        {/* Floating Quick Stats - Mobile Only */}
        {/* <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button 
            onClick={() => setActiveTab('assistant')}
            className="w-14 h-14 bg-orange-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform"
          >
            🤖
          </button>
        </div> */}

      </div>
        {/* <Client /> */}
        
    </div>
  )
}

export default AdminLayout