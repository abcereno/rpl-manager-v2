// src/App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"; // Added Outlet
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
// Removed Index import as it's less relevant now
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import AppLayout from "@/components/AppLayout";
import InviteTestPage from "./pages/InviteTestPage"; // Import the test invite page
import { Skeleton } from "@/components/ui/skeleton";
import { StudentDashboard } from './components/StudentDashboard'; // Import dashboards directly
import { PortfolioTeamView } from './components/PortfolioTeamView';
import { RTOAssessorView } from './components/RTOAssessorView';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC = () => {
    const { session, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Skeleton className="h-10 w-40" />
            </div>
        );
    }

    if (!session || !profile) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render child routes within AppLayout if authenticated
    return (
        <AppLayout>
            <Outlet /> {/* Renders the nested child route component */}
        </AppLayout>
    );
};

// Component to render the correct dashboard based on role
const HomeDashboard: React.FC = () => {
    const { profile } = useAuth();
    switch (profile?.role) {
        case 'student':
            return <StudentDashboard />;
        case 'portfolio_team':
        case 'admin':
            return <PortfolioTeamView />;
        case 'rto_assessor':
            return <RTOAssessorView />;
        default:
            return <Skeleton className="h-64 w-full" />; // Or a default/error view
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
              <Route path="/invite-test" element={<InviteTestPage />} /> {/* Public test invite route */}

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                 <Route path="/" element={<HomeDashboard />} />
                 {/* Add other protected routes here later */}
                 {/* Example: <Route path="/profile" element={<ProfilePage />} /> */}
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