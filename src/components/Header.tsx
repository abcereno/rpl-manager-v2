import React from 'react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, userName }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/689aae299653328b557d3d11_1760592055872_ea362fa3.png"
              alt="Trade Certify"
              className="h-10"
            />
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => onRoleChange('student')}
                className={`font-semibold transition-colors ${
                  currentRole === 'student' ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]'
                }`}
              >
                Student View
              </button>
              <button 
                onClick={() => onRoleChange('portfolio_team')}
                className={`font-semibold transition-colors ${
                  currentRole === 'portfolio_team' ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]'
                }`}
              >
                Portfolio Team
              </button>
              <button 
                onClick={() => onRoleChange('rto_assessor')}
                className={`font-semibold transition-colors ${
                  currentRole === 'rto_assessor' ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]'
                }`}
              >
                RTO Assessor
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#373b40]">{userName}</span>
            <div className="w-10 h-10 bg-[#fdb715] rounded-full flex items-center justify-center text-white font-bold">
              {userName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
