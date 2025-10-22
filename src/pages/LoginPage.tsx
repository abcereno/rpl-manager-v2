// src/pages/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button'; //
import { Input } from '@/components/ui/input'; //
import { Label } from '@/components/ui/label'; //
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'; //

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Redirect is handled by the AuthProvider's effect listening to auth state changes
    } catch (error) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

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
                 disabled={loading}
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
                 disabled={loading}
               />
             </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
             <Button type="submit" className="w-full bg-[#fdb715] hover:bg-yellow-600" disabled={loading}>
               {loading ? 'Logging in...' : 'Login'}
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