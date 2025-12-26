'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';



const Sidebar = () => {
  const pathname = usePathname(); // Get current path
  const router = useRouter();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: ROUTES.admin.dashboard },
    { id: 'products', label: 'Products', icon: '📦', path: ROUTES.admin.products },
    { id: 'orders', label: 'Orders', icon: '🏷️', path: ROUTES.admin.orders },
    { id: 'users', label: 'Users', icon: '📢', path: ROUTES.admin.users },
    { id: 'analytics', label: 'Analytics', icon: '📊', path: ROUTES.admin.analytics },
    { id: 'marketing', label: 'Marketing', icon: '🤖', path: ROUTES.admin.marketing },
    { id: 'assistant', label: 'Assistant', icon: '🤖', path: ROUTES.admin.marketing },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen hidden md:flex flex-col sticky top-0">
      <div className="p-6 border-b flex items-center space-x-2">
        <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">Amz</span>
        </div>
        <span className="font-bold text-xl tracking-tight">Analytics</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500 rounded-l-none'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t bg-gray-50 text-xs text-gray-500">
        <p className="font-semibold text-gray-700">Premium Plan</p>
        <p>Enterprise access enabled</p>
        <button className="mt-2 text-orange-600 font-bold hover:underline">Manage Account</button>
      </div>
    </div>
  );
};

export default Sidebar;
