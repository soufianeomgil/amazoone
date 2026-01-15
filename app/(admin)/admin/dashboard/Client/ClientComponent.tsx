"use client"
import Sidebar from '@/components/shared/SideBar';
import React, { useState } from 'react';
import Dashboard from '../page';
import AIChat from '@/components/shared/AiChat';
import Image from 'next/image';


const Client = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      {/* Navigation Sidebar */}
      <Sidebar  />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Amazon-style Top Header */}
        <header className="h-16 bg-[#131921] flex items-center px-6 justify-between shrink-0 z-10">
          <div className="flex items-center flex-1 max-w-2xl">
            <div className="md:hidden mr-4 text-white text-2xl">☰</div>
            <div className="relative w-full">
              <input 
                type="text"
                placeholder="Search analytics, products, or help..."
                className="w-full h-10 px-4 rounded-l-md border-none focus:ring-2 focus:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-[-44px] top-0 h-10 w-11 amazon-orange-bg amazon-orange-hover rounded-r-md flex items-center justify-center transition-colors">
                🔍
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-6 ml-12 text-white">
            <div className="hidden lg:flex flex-col">
              <span className="text-[10px] opacity-70">Hello, Alex</span>
              <span className="text-sm font-bold">Account & Lists</span>
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-[10px] opacity-70">Returns</span>
              <span className="text-sm font-bold">& Orders</span>
            </div>
            <div className="flex items-center relative cursor-pointer group">
               <div className="w-10 h-10 bg-gray-700 rounded-full border-2 border-orange-400 overflow-hidden">
                 <Image width={100} height={100} src="https://picsum.photos/seed/user123/100/100" alt="Avatar" />
               </div>
               <div className="absolute top-10 right-0 w-48 bg-white text-gray-800 shadow-xl rounded-md border mt-2 hidden group-hover:block p-2">
                 <ul className="text-sm">
                   <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Profile Settings</li>
                   <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Security</li>
                   <li className="p-2 hover:bg-gray-100 rounded cursor-pointer border-t mt-1 text-red-600">Sign Out</li>
                 </ul>
               </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'assistant' && <AIChat />}
            
            {(activeTab !== 'dashboard' && activeTab !== 'assistant') && (
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
            )}
          </div>
        </main>

        {/* Floating Quick Stats - Mobile Only */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button 
            onClick={() => setActiveTab('assistant')}
            className="w-14 h-14 bg-orange-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform"
          >
            🤖
          </button>
        </div>

      </div>
    </div>
  );
};

export default Client;