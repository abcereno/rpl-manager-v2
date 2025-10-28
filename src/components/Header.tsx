import React from 'react';
import { UserRole } from '../types';
import { Button } from './ui/button';
import { LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
// Removed useAuth import as role info comes via props now

interface HeaderProps {
  currentRole: UserRole | undefined; // Display role (can be temp for admins/portfolio)
  onRoleChange: (role: UserRole) => void;
  userName: string;
  showAdminControls: boolean; // Renamed from isAdmin for clarity
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  userName,
  showAdminControls, // Use the new prop name
  onSignOut
}) => {
  const location = useLocation();

  const isNavLinkActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo Link (Always visible) */}
            <Link to="/" aria-label="Go to Dashboard">
                <img
                    src="https://d64gsuwffb70l.cloudfront.net/689aae299653328b557d3d11_1760592055872_ea362fa3.png"
                    alt="Trade Certify"
                    className="h-10"
                />
            </Link>

             {/* Admin/Portfolio-Specific Navigation */}
             {showAdminControls && ( // Use the new prop name here
               <nav className="hidden md:flex gap-6 items-center">
                 {/* View Switching Buttons */}
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
                     (currentRole === 'portfolio_team' || currentRole === 'admin') ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]' // Highlight for both admin/portfolio if viewing portfolio
                   }`}
                 >
                   Portfolio View
                 </button>
                 <button
                   onClick={() => onRoleChange('rto_assessor')}
                   className={`font-semibold transition-colors ${
                     currentRole === 'rto_assessor' ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]'
                   }`}
                 >
                   RTO View
                 </button>

                 {/* Separator */}
                 <div className="h-6 w-px bg-gray-200"></div>

                 {/* Admin Management Link */}
                 <Link
                   to="/admin/manage"
                   className={`flex items-center gap-1 font-semibold transition-colors ${
                     isNavLinkActive('/admin/manage') ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]'
                   }`}
                 >
                   <Settings className="h-4 w-4" />
                   Manage Users
                 </Link>
               </nav>
             )}
             {/* No extra links needed for student or rto_assessor roles */}

          </div>
          <div className="flex items-center gap-4">
            {/* User Profile Info and Logout (Always visible) */}
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
