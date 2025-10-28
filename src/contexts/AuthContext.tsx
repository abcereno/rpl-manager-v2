// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { UserRole } from '@/types';

interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  // We can add back a loading state just for the *initial* check
  initialLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>; // Add a way to manually refresh
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initialLoading, setInitialLoading] = useState(true); // Track initial load

  // Fetch profile function (remains the same)
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`id, full_name, avatar_url, role`)
        .eq('id', userId)
        .single();

      if (error && status !== 406) {
        console.error('Error fetching profile:', error);
        return null;
      }
      if (data) {
        console.log("Profile fetched:", data);
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

  // Function to manually check and update session state
  const refreshSessionData = async () => {
      setInitialLoading(true); // Indicate loading during refresh
      try {
          const { data: { session: currentSession }, error } = await supabase.auth.getSession();
          if (error) throw error;

          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
              const fetchedProfile = await fetchProfile(currentSession.user.id);
              setProfile(fetchedProfile);
          } else {
              setProfile(null);
          }
      } catch (err) {
          console.error("Error refreshing session data:", err);
          setSession(null);
          setUser(null);
          setProfile(null);
      } finally {
          setInitialLoading(false); // Finish loading state
      }
  };


  // useEffect now ONLY runs once on mount to check initial state
  useEffect(() => {
    refreshSessionData(); // Call the refresh function on initial mount

    // REMOVED onAuthStateChange listener entirely
    // No return function needed to unsubscribe

  }, []); // Empty dependency array ensures this runs only once

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error);
    } else {
        // Manually clear state after successful sign out
        setSession(null);
        setUser(null);
        setProfile(null);
    }
  };

  const value = {
    session,
    user,
    profile,
    initialLoading, // Provide the initial loading state
    signOut,
    refreshSession: refreshSessionData, // Expose the refresh function
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