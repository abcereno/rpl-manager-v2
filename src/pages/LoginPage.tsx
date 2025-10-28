// src/pages/LoginPage.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { Navigate, useNavigate } from 'react-router-dom'; // Import Navigate and useNavigate

const LoginPage: React.FC = () => {
  // Use initialLoading, session, and refreshSession from the simplified context
  const { session, initialLoading, refreshSession } = useAuth();
  const navigate = useNavigate(); // Hook for potential programmatic navigation after login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Local loading state for form submission
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true); // Start form submission loading
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      // Login successful, manually refresh context state
      // The redirect check below will handle navigation after state updates
      await refreshSession();

      // No need to set loading false here if refreshSession handles navigation via re-render

    } catch (err) { // Catch renamed to err to avoid conflict with error state
      setError(err.error_description || err.message);
      setLoading(false); // Stop form loading on error
    }
    // setLoading(false); // Might not be reached if refreshSession causes redirect immediately
  };

  // --- Redirect Check ---
  // If the initial auth check is done (!initialLoading) AND a session exists, redirect
  if (!initialLoading && session) {
      console.log("LoginPage: Session exists, redirecting..."); // Added log
    return <Navigate to="/" replace />;
  }
  // --- End of Redirect Check ---


  // --- Initial Loading State ---
  // Show loading indicator only during the very first context load
  if (initialLoading) {
      console.log("LoginPage: Initial loading..."); // Added log
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
             {/* Simple loading text or a Skeleton component */}
             <p>Loading...</p>
         </div>
      );
  }
  // --- End of Initial Loading State ---

  // Render the login form only if initial loading is done AND there is no session
  console.log("LoginPage: Rendering form..."); // Added log
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
       <Card className="w-full max-w-sm">
        <CardHeader>
           <CardTitle className="text-2xl font-bold text-center text-[#373b40]">Login</CardTitle>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleLogin} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 placeholder="your@email.com"
                 disabled={loading} // Use form's loading state
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="password">Password</Label>
               <Input
                 id="password"
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 placeholder="••••••••"
                 disabled={loading} // Use form's loading state
               />
             </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
             <Button type="submit" className="w-full bg-[#fdb715] hover:bg-yellow-600" disabled={loading}>
               {loading ? 'Logging in...' : 'Login'} {/* Use form's loading state */}
             </Button>
           </form>
         </CardContent>
          <CardFooter className="text-center text-sm text-gray-600">
              {/* Add link to password reset or signup if needed */}
          </CardFooter>
       </Card>
    </div>
  );
};

export default LoginPage;