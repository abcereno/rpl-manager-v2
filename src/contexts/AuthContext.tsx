// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { UserRole } from '@/types';

// --- UPDATED Profile Interface ---
interface Profile {
  id: string;
  full_name?: string | null; // Allow null from DB
  avatar_url?: string | null; // Allow null from DB
  role: UserRole;
  company_id?: string | null; // Added (optional and nullable)
  rto_id?: string | null;     // Added (optional and nullable)
}
// --------------------------------

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  initialLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      // --- UPDATED Select Statement ---
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          avatar_url,
          role,
          company_id,
          rto_id
        `) // Added company_id, rto_id
        .eq('id', userId)
        .single();
      // --------------------------------

      if (error && status !== 406) { // 406 means no rows found, which is okay
        console.error('Error fetching profile:', error);
        return null;
      }
      if (data) {
        console.log("Profile fetched:", data);
        // Cast the fetched data to the updated Profile interface
        return data as Profile;
      } else {
        console.warn("No profile found for user:", userId);
        return null;
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };

  const refreshSessionData = async () => {
      setInitialLoading(true);
      try {
          const { data: { session: currentSession }, error } = await supabase.auth.getSession();
          if (error) throw error;

          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
              const fetchedProfile = await fetchProfile(currentSession.user.id);
              setProfile(fetchedProfile); // This will now include company_id and rto_id if they exist
          } else {
              setProfile(null);
          }
      } catch (err) {
          console.error("Error refreshing session data:", err);
          setSession(null);
          setUser(null);
          setProfile(null);
      } finally {
          setInitialLoading(false);
      }
  };


  useEffect(() => {
    refreshSessionData();
    // No auth state change listener needed with this manual refresh approach
  }, []); // Empty dependency array ensures this runs only once on mount

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error);
    } else {
        setSession(null);
        setUser(null);
        setProfile(null);
    }
  };

  const value = {
    session,
    user,
    profile,
    initialLoading,
    signOut,
    refreshSession: refreshSessionData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};