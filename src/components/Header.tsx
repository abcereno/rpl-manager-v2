// src/components/Header.tsx
import React from 'react';
import { UserRole } from '../types'; //
import { Button } from './ui/button'; //
import { LogOut } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole; // This now represents the *displayed* role
  onRoleChange: (role: UserRole) => void; // For admins to switch view
  userName: string;
  isAdmin: boolean; // Flag to indicate if the current user is an admin
  onSignOut: () => void; // Sign out function
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  userName,
  isAdmin,
  onSignOut
}) => {
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
             {/* Only show role switching nav if user is an admin */}
             {isAdmin && (
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
             )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#373b40] hidden sm:inline">{userName}</span>
             <div className="w-8 h-8 bg-[#fdb715] rounded-full flex items-center justify-center text-white font-bold text-sm sm:w-10 sm:h-10 sm:text-base">
               {userName?.charAt(0)?.toUpperCase() || '?'}
             </div>
             <Button
                variant="ghost"
                size="icon"
                onClick={onSignOut}
                aria-label="Sign Out"
                className="text-gray-600 hover:text-red-600"
              >
               <LogOut className="h-5 w-5" />
             </Button>
          </div>
        </div>
      </div>
    </header>
  );
};