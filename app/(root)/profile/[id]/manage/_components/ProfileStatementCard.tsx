import { ChevronDown } from 'lucide-react';
import React from 'react'

const ProfileStatementCard = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <div className="flex items-center px-6 py-5 justify-between bg-gradient-to-r from-white to-gray-50">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-500 text-sm font-normal">
          {desc}
        </p>
      </div>
      <ChevronDown size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
    </div>
  );
};
export default ProfileStatementCard