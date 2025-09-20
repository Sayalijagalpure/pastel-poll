import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'voter';

export interface UserWithRole extends User {
  role?: UserRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get user role from localStorage
  const getUserRole = (email: string): UserRole | undefined => {
    const userRoles = localStorage.getItem('userRoles');
    if (userRoles) {
      const roles = JSON.parse(userRoles);
      return roles[email];
    }
    return undefined;
  };

  // Helper function to create user with role
  const createUserWithRole = (user: User | null): UserWithRole | null => {
    if (!user) return null;
    const role = getUserRole(user.email || '');
    return { ...user, role };
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setSession(session);
        setUser(createUserWithRole(session?.user ?? null));
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(createUserWithRole(session?.user ?? null));
          setLoading(false);
        }
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const setUserRole = (email: string, role: UserRole) => {
    const userRoles = localStorage.getItem('userRoles');
    const roles = userRoles ? JSON.parse(userRoles) : {};
    roles[email] = role;
    localStorage.setItem('userRoles', JSON.stringify(roles));
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      // Store user role
      setUserRole(email, role);
      toast({
        title: "Success!",
        description: "Please check your email for verification link"
      });
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string, role?: UserRole) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive"
      });
    } else if (role) {
      // Store or update user role on login
      setUserRole(email, role);
      // Update current user with new role
      const currentUser = user;
      if (currentUser) {
        setUser({ ...currentUser, role });
      }
    }
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    setUserRole
  };
};