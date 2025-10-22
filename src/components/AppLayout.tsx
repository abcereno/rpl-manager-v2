// src/components/AppLayout.tsx
import { Header } from './Header'; //
import { StudentDashboard } from './StudentDashboard'; //
import { PortfolioTeamView } from './PortfolioTeamView'; //
import { RTOAssessorView } from './RTOAssessorView'; //
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { UserRole } from '../types'; //
import { Skeleton } from "@/components/ui/skeleton"; //
import { Button } from './ui/button'; //
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {  const { profile, loading, signOut, user} = useAuth(); // Get profile, loading state, user and signOut from context

   // Temporary role switching state, only if user is admin
   const [tempViewRole, setTempViewRole] = useState<UserRole | null>(null);

   const isAdmin = profile?.role === 'admin';
   // Determine the role to display: temp view if set by admin, otherwise user's actual role
   const displayRole = isAdmin && tempViewRole ? tempViewRole : profile?.role;

   // Handler for role switching in header (only affects displayRole if admin)
   const handleRoleViewChange = (role: UserRole) => {
     if (isAdmin) {
       setTempViewRole(role);
     }
     // Non-admins cannot change their view via the header buttons
   };


  const renderView = () => {
     if (loading || !profile) {
        // Show loading skeletons while profile is loading or if profile is missing
        return (
          <div className="space-y-6">
             <Skeleton className="h-24 w-full" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
             </div>
              <Skeleton className="h-64 w-full" />
          </div>
       );
     }


    switch (displayRole) { // Use displayRole which respects admin temporary view
      case 'student':
        return <StudentDashboard />;
      case 'portfolio_team':
      case 'admin': // Admins see portfolio view by default unless switched
        return <PortfolioTeamView />;
      case 'rto_assessor':
        return <RTOAssessorView />;
      default:
         console.warn("Unknown or missing role:", profile?.role, "Defaulting to Student Dashboard.");
         // Fallback for unexpected roles or if profile fetch failed but user is logged in
         return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        // Pass the actual role or the temp role for highlighting the correct button
        currentRole={displayRole || 'student'}
        // Allow admins to change the temp view
        onRoleChange={handleRoleViewChange}
        // Display user name from profile or fallback
        userName={profile?.full_name || user?.email || 'User'}
        // Pass isAdmin flag to conditionally show role buttons in header
        isAdmin={isAdmin}
        onSignOut={signOut} // Pass signout function
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      {/* Footer... (keep existing footer) */}
       <footer className="bg-[#373b40] text-white mt-16">
         {/* ... Footer content remains the same ... */}
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