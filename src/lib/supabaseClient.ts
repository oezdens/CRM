import { createClient } from '@supabase/supabase-js';

// Vite verwendet import.meta.env für Umgebungsvariablen
// Erstelle eine .env Datei im Root-Verzeichnis:
// VITE_SUPABASE_URL=https://dein-projekt.supabase.co
// VITE_SUPABASE_ANON_KEY=dein-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);