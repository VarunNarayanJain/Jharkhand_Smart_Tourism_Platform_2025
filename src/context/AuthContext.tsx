import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  registerCleanupFunction: (cleanup: () => void) => void;
  unregisterCleanupFunction: (cleanup: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const cleanupFunctions = useRef<Set<() => void>>(new Set());

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 Auth state changed:', _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('❌ Signup error:', error);
        return { error };
      }

      console.log('✅ Signup successful:', data);

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: email,
            name: name,
          });

        if (profileError) {
          console.error('❌ Profile creation error:', profileError);
        }
      }

      return { error: null };
    } catch (err) {
      console.error('❌ Unexpected signup error:', err);
      return { error: err as AuthError };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        return { error };
      }

      console.log('✅ Login successful:', data);
      return { error: null };
    } catch (err) {
      console.error('❌ Unexpected login error:', err);
      return { error: err as AuthError };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('❌ Google sign-in error:', error);
        return { error };
      }

      console.log('✅ Google sign-in initiated:', data);
      return { error: null };
    } catch (err) {
      console.error('❌ Unexpected Google sign-in error:', err);
      return { error: err as AuthError };
    }
  };

  // Register cleanup function
  const registerCleanupFunction = (cleanup: () => void) => {
    cleanupFunctions.current.add(cleanup);
  };

  // Unregister cleanup function
  const unregisterCleanupFunction = (cleanup: () => void) => {
    cleanupFunctions.current.delete(cleanup);
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log('🧹 Running cleanup functions before logout...');
      // Run all registered cleanup functions
      cleanupFunctions.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (err) {
          console.error('❌ Error in cleanup function:', err);
        }
      });

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Logout error:', error);
        throw error;
      }
      console.log('✅ Logout successful');
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('❌ Unexpected logout error:', err);
      throw err;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    registerCleanupFunction,
    unregisterCleanupFunction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
