import React, { useState } from 'react';
import { Outlet } from "react-router-dom"; // Import Outlet
import { Header } from './Header';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '../types';
import { Skeleton } from "@/components/ui/skeleton";


export default function AppLayout() {
  // Assuming simplified AuthContext with initialLoading
  const { profile, initialLoading, signOut, user } = useAuth();
  const [tempViewRole, setTempViewRole] = useState<UserRole | null>(null);

  // Check if the user is either 'admin' or 'portfolio_team'
  const canManageViews = profile?.role === 'admin' || profile?.role === 'portfolio_team';
  // Determine the role to display for header styling/controls
  // If the user can manage views and has selected a temp role, use that, otherwise use their actual role
  const displayRole = canManageViews && tempViewRole ? tempViewRole : profile?.role;

  const handleRoleViewChange = (role: UserRole) => {
    // Only allow changing view if the user has the necessary permissions
    if (canManageViews) {
      setTempViewRole(role);
    }
  };

  if (initialLoading) {
     return (
          <div className="min-h-screen flex items-center justify-center">
             <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <Skeleton className="h-16 w-full" /> {/* Header Placeholder */}
                <Skeleton className="h-64 w-full" /> {/* Main Content Placeholder */}
             </div>
          </div>
       );
  }

  // Ensure profile is loaded before rendering the main layout
  if (!profile) {
      // This case might happen briefly even if initialLoading is false, handle gracefully
       console.warn("AppLayout: Profile not available yet.");
       return ( // Render a loading state or redirect if necessary
           <div className="min-h-screen flex items-center justify-center">
               <p>Loading user profile...</p>
           </div>
       );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        // Pass the display role for header controls/styling
        currentRole={displayRole || 'student'} // Use displayRole, fallback needed
        onRoleChange={handleRoleViewChange}
        userName={profile?.full_name || user?.email || 'User'}
        // Pass the updated flag determining if admin controls should show
        showAdminControls={canManageViews}
        onSignOut={signOut}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render the matched nested route component here */}
        <Outlet />
      </main>

      {/* Footer... */}
       <footer className="bg-[#373b40] text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               <div>
                 <img
                   src="https://d64gsuwffb70l.cloudfront.net/689aae299653328b557d3d11_1760592055872_ea362fa3.png"
                   alt="Trade Certify"
                   className="h-10 mb-4 brightness-0 invert"
                 />
                 <p className="text-gray-400 text-sm">
                   Streamlining Recognition of Prior Learning for the trades industry
                 </p>
               </div>
               <div>
                 <h4 className="font-bold mb-4">Platform</h4>
                 <ul className="space-y-2 text-sm text-gray-400">
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">For Students</a></li>
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">For Portfolio Teams</a></li>
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">For RTOs</a></li>
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">Enterprise</a></li>
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold mb-4">Resources</h4>
                 <ul className="space-y-2 text-sm text-gray-400">
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">Help Center</a></li>
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">Documentation</a></li>
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">API</a></li>
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">Status</a></li>
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold mb-4">Company</h4>
                 <ul className="space-y-2 text-sm text-gray-400">
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">About</a></li>
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">Contact</a></li>
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">Privacy</a></li>
                   <li><a href="#" className="hover:text-[#fdb715] transition-colors">Terms</a></li>
                 </ul>
               </div>
             </div>
             <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
               <p>© 2025 Trade Certify. All rights reserved.</p>
             </div>
          </div>
       </footer>
    </div>
  );
}
