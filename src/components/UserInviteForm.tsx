// src/components/UserInviteForm.tsx
import React, { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { UserRole } from '@/types'; // Ensure type is 'student' | 'rto_assessor' | 'admin'
import { Button } from '@/components/ui/button'; //
import { Input } from '@/components/ui/input'; //
import { Label } from '@/components/ui/label'; //
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; //
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'; //
import { Alert, AlertDescription } from "@/components/ui/alert"; //

// Roles available for creation
const availableRoles: UserRole[] = ['student', 'rto_assessor', 'admin'];

export const UserInviteForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [companyId, setCompanyId] = useState(''); // Required for 'admin'
  const [rtoId, setRtoId] = useState('');       // Required for 'rto_assessor'
  const [loading, setLoading] = useState(false);
  // Message type no longer includes 'warning'
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Using the standard Anon client (relies on SQL trigger and RLS)
  const supabaseClientForCreation = supabase;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Enhanced Validation
    let missingInfo = '';
    if (!email) missingInfo += 'Email, ';
    if (!fullName) missingInfo += 'Full Name, ';
    if (!password) missingInfo += 'Password, ';
    if (!role) missingInfo += 'Role, ';
    if (role === 'admin' && !companyId) missingInfo += 'Company ID (required for Admin), ';
    if (role === 'rto_assessor' && !rtoId) missingInfo += 'RTO ID (required for Assessor), ';

    if (missingInfo) {
      setMessage({ type: 'error', text: `Please fill in required fields: ${missingInfo.slice(0, -2)}.` });
      return;
    }
    if (password.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters.'});
        return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log(`Attempting to create user: ${email} with role ${role}`);

      // Prepare metadata for the SQL trigger
      const metaData: { [key: string]: string } = {
        full_name: fullName,
        role: role,
        company_id: role === 'admin' && companyId ? companyId : undefined,
        rto_id: role === 'rto_assessor' && rtoId ? rtoId : undefined,
      };
      // Remove undefined keys
      Object.keys(metaData).forEach(key => metaData[key] === undefined && delete metaData[key]);
      console.log("Sending metadata:", metaData);

      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseClientForCreation.auth.signUp({
        email: email,
        password: password,
        options: { data: metaData }
      });

      // Handle Auth errors
      if (authError) {
        if (authError.message.includes("User already registered")) {
            setMessage({ type: 'error', text: `User with email ${email} already exists.` });
            return; // Stop execution (finally block will handle setLoading)
        }
        throw new Error(`Auth Error: ${authError.message}`);
      }
      if (!authData.user) throw new Error("User created in auth, but user data is missing."); // Failsafe

      // --- REMOVED Verification Step ---

      // Assume success if signUp didn't throw an error
      console.log(`User created successfully in Auth: ${authData.user.id}. Trigger should handle profile.`);
      setMessage({ type: 'success', text: `Test user ${email} created as ${role}. Profile/Role assigned by backend trigger.` });

      // Clear form on success
      setEmail(''); setPassword(''); setFullName(''); setRole(''); setCompanyId(''); setRtoId('');

    } catch (error) { // Catch any errors (Auth errors primarily)
      console.error('Test account creation error:', error);
      setMessage({ type: 'error', text: `Failed: ${error.message}` });
    } finally {
      setLoading(false); // Ensure loading state is reset in all cases
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto my-8 border-orange-400 border-2">
      <CardHeader>
        <CardTitle className="text-orange-600">⚠️ Create Test User (Dev Only)</CardTitle>
        <CardDescription className="text-orange-500">
          Creates Auth user directly. Relies on SQL trigger `handle_new_user` for profile/role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
           {/* Name, Email, Password Inputs */}
           <div className="space-y-2">
             <Label htmlFor="test-name">Full Name</Label>
             <Input id="test-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Test User Name" disabled={loading} />
           </div>
           <div className="space-y-2">
             <Label htmlFor="test-email">Email Address</Label>
             <Input id="test-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="test.user@example.com" disabled={loading} />
           </div>
           <div className="space-y-2">
             <Label htmlFor="test-password">Password (min 6 chars)</Label>
             <Input id="test-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" disabled={loading} />
           </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="test-role">Assign Role</Label>
             <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={loading} required>
                <SelectTrigger id="test-role"><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>
                  {availableRoles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
             </Select>
          </div>

          {/* Conditional Inputs for IDs */}
          {role === 'admin' && (
             <div className="space-y-2">
               <Label htmlFor="test-company-id">Company ID (UUID - Required for Admin)</Label>
               <Input id="test-company-id" type="text" value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="Enter valid Company UUID" disabled={loading} required/>
             </div>
          )}
          {role === 'rto_assessor' && (
             <div className="space-y-2">
               <Label htmlFor="test-rto-id">RTO ID (UUID - Required for Assessor)</Label>
               <Input id="test-rto-id" type="text" value={rtoId} onChange={(e) => setRtoId(e.target.value)} placeholder="Enter valid RTO UUID" disabled={loading} required/>
             </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || !email || !role || !password || !fullName}>
            {loading ? 'Creating Test User...' : 'Create Test User'}
          </Button>
        </form>
      </CardContent>
      {/* Feedback Alert */}
      {message && (
        <CardFooter>
            {/* Removed 'warning' option */}
            <Alert variant={ message.type === 'error' ? 'destructive' : 'success' }>
               <AlertDescription>{message.text}</AlertDescription>
             </Alert>
        </CardFooter>
      )}
    </Card>
  );
};