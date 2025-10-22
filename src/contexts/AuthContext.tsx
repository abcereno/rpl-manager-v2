// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { UserRole } from '@/types'; // Import your UserRole type

interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  // Add other profile fields if needed
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false); // No user, stop loading
      }
    });

    // 2. Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session);
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
           await fetchProfile(currentUser.id); // Fetch profile on change
        } else {
          setProfile(null); // Clear profile on logout
          setLoading(false); // Ensure loading stops on logout
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
     setLoading(true); // Start loading when fetching profile
     try {
       const { data, error, status } = await supabase
         .from('profiles')
         .select(`id, full_name, avatar_url, role`)
         .eq('id', userId)
         .single();

       if (error && status !== 406) {
         console.error('Error fetching profile:', error);
         throw error;
       }

       if (data) {
         console.log("Profile fetched:", data);
         setProfile(data as Profile);
       } else {
           console.warn("No profile found for user:", userId);
           setProfile(null); // Set profile to null if not found
       }
     } catch (error) {
       console.error('Exception fetching profile:', error);
       setProfile(null); // Clear profile on error
     } finally {
        setLoading(false); // Stop loading after fetch attempt
     }
  };


  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    // State updates handled by onAuthStateChange listener
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
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