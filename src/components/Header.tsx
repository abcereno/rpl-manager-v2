// src/components/Header.tsx
import React from 'react';
import { UserRole } from '../types'; // Make sure UserRole includes 'admin'
import { Button } from './ui/button';
import { LogOut, Settings, Users, Building, LayoutDashboard } from 'lucide-react'; // Added icons
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth to get the actual role

interface HeaderProps {
  // Removed currentRole and onRoleChange as view switching is being removed for admin
  userName: string;
  // Removed showAdminControls, we'll use the actual role now
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  onSignOut
}) => {
  const location = useLocation();
  const { profile } = useAuth(); // Get the profile which contains the role
  const actualRole = profile?.role; // Get the user's real role

  const isNavLinkActive = (path: string) => location.pathname === path;

  // Function to render navigation based on the actual role
  const renderNavigation = () => {
    switch (actualRole) {
      case 'admin':
        return (
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              to="/"
              className={`flex items-center gap-1 font-semibold transition-colors ${
                isNavLinkActive('/') ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/admin/students" // New route for student list
              className={`flex items-center gap-1 font-semibold transition-colors ${
                isNavLinkActive('/admin/students') ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]'
              }`}
            >
              <Users className="h-4 w-4" />
              Students
            </Link>
            <Link
              to="/admin/rtos" // New route for RTO list
              className={`flex items-center gap-1 font-semibold transition-colors ${
                isNavLinkActive('/admin/rtos') ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]'
              }`}
            >
              <Building className="h-4 w-4" />
              RTOs
            </Link>
            <Link
              to="/admin/manage" // Existing route for settings/management
              className={`flex items-center gap-1 font-semibold transition-colors ${
                isNavLinkActive('/admin/manage') ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]'
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        );
      case 'portfolio_team':
        // Portfolio team still needs view switching? Or specific links?
        // Keeping view switching for now as per previous logic for non-admin managers
        // You might want dedicated links like admin later.
         return (
             <nav className="hidden md:flex gap-6 items-center">
                 {/* Re-implement view switching logic here if needed */}
                 {/* For now, just showing the manage link */}
                 <Link
                   to="/admin/manage" // Assuming portfolio team uses the same management page
                   className={`flex items-center gap-1 font-semibold transition-colors ${
                     isNavLinkActive('/admin/manage') ? 'text-[#fdb715]' : 'text-gray-600 hover:text-[#373b40]'
                   }`}
                 >
                   <Settings className="h-4 w-4" />
                   Manage Users
                 </Link>
             </nav>
         );
        // Add cases for 'student' and 'rto_assessor' if they need specific links,
        // otherwise they will render nothing, which is the desired outcome.
      case 'student':
      case 'rto_assessor':
      default:
        return null; // No extra nav links for students or assessors
    }
  };

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

             {/* Role-Specific Navigation */}
             {renderNavigation()}

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