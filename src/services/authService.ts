import { supabase } from '@/lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

// Login mit E-Mail und Passwort
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data?.user || null,
    session: data?.session || null,
    error: error ? { message: error.message } : null,
  };
};

// Logout
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error: error ? { message: error.message } : null };
};

// Aktuelle Session abrufen
export const getCurrentSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
};

// Aktuellen User abrufen
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

// Auth State Change Listener
export const onAuthStateChange = (
  callback: (event: string, session: Session | null) => void
) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

// Registrierung (optional, falls du später brauchst)
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return {
    user: data?.user || null,
    session: data?.session || null,
    error: error ? { message: error.message } : null,
  };
};
