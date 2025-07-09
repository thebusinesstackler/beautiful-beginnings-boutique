
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolesFetched, setRolesFetched] = useState(false);

  const fetchProfile = async (userId: string) => {
    // Prevent multiple concurrent fetches
    if (rolesFetched) return;
    
    try {
      console.log('Fetching profile for user:', userId);
      
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        // Set empty profile with just email to prevent infinite retries
        setProfile({
          id: userId,
          email: user?.email || session?.user?.email || '',
          roles: []
        });
        setRolesFetched(true);
        return;
      }

      const roles = rolesData?.map(r => r.role) || [];
      const userEmail = user?.email || session?.user?.email || '';

      setProfile({
        id: userId,
        email: userEmail,
        roles
      });
      
      setRolesFetched(true);
      console.log('Profile fetched successfully:', { userId, email: userEmail, roles });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Set empty profile to prevent infinite retries
      setProfile({
        id: userId,
        email: user?.email || session?.user?.email || '',
        roles: []
      });
      setRolesFetched(true);
    }
  };

  const hasRole = (role: string): boolean => {
    return profile?.roles?.includes(role) || false;
  };

  const isAdmin = hasRole('admin');

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Reset roles fetched flag when user changes
          setRolesFetched(false);
          // Use setTimeout to prevent blocking the auth state change
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 100);
        } else {
          setProfile(null);
          setRolesFetched(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []); // Remove user dependency to prevent infinite loops

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    setRolesFetched(false);
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
