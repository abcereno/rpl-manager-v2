import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
// Use alias for consistency
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
// Use alias for consistency
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import AppLayout from "@/components/AppLayout";
import InviteTestPage from "@/pages/InviteTestPage";
import { Skeleton } from "@/components/ui/skeleton";
// Use alias for consistency
import { StudentDashboard } from '@/components/StudentDashboard';
import { PortfolioTeamView } from '@/components/PortfolioTeamView';
import { RTOAssessorView } from '@/components/RTOAssessorView';
import { AdminManagement } from '@/components/AdminManagement';

const queryClient = new QueryClient();

// Protected Route Component - Corrected
const ProtectedRoute: React.FC = () => {
    // Assuming simplified AuthContext with initialLoading
    const { session, initialLoading, profile } = useAuth();

    // Still handle initial loading
     if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {/* Use a skeleton that roughly matches the layout */}
                 <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    <Skeleton className="h-16 w-full" /> {/* Header Placeholder */}
                    <Skeleton className="h-64 w-full" /> {/* Main Content Placeholder */}
                 </div>
            </div>
        );
    }

    // Check session AND profile after initial load
    // (Ensure profile is loaded before rendering layout requiring role)
    if (!session || !profile) {
        // Redirect to login if not authenticated or profile not ready
        return <Navigate to="/login" replace />;
    }

    // Render ONLY AppLayout. AppLayout itself contains the <Outlet />
    // for nested routes like '/' and '/admin/manage'.
    return <AppLayout />;
};

// Component to render the correct dashboard based on role for the '/' route
const HomeDashboard: React.FC = () => {
    const { profile } = useAuth(); // Assuming profile is loaded because ProtectedRoute checks it

    switch (profile?.role) {
        case 'student':
            return <StudentDashboard />;
        case 'portfolio_team':
        case 'admin':
            return <PortfolioTeamView />;
        case 'rto_assessor':
            return <RTOAssessorView />;
        default:
            console.warn("HomeDashboard: Role unknown or profile temporarily unavailable:", profile?.role);
            return <Skeleton className="h-64 w-full" />;
    }
};


const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/invite-test" element={<InviteTestPage />} />

              {/* Protected Routes Wrapper */}
              {/* The element here is the component responsible for checking auth and rendering the layout */}
              <Route element={<ProtectedRoute />}>
                  {/* Nested routes that will be rendered inside AppLayout's <Outlet /> */}
                  <Route path="/" element={<HomeDashboard />} />
                  <Route path="/admin/manage" element={<AdminManagement />} />
                  {/* Add other protected routes here later */}
              </Route>

              {/* Catch All Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;