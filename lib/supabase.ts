import { createClient, SupabaseClient } from '@supabase/supabase-js';

const sanitizeEnvVar = (val: string | undefined): string | undefined => {
  if (!val) return undefined;
  return val.trim().replace(/^["']|["']$/g, '');
};

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = sanitizeEnvVar(rawUrl);
const supabaseAnonKey = sanitizeEnvVar(rawKey);

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing.');
    return createClient(
      'https://placeholder.supabase.co', 
      'placeholder'
    );
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// For convenience, but use getSupabase() to be safe
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

