import { createClient, SupabaseClient } from '@supabase/supabase-js';

const sanitizeEnvVar = (val: string | undefined): string | undefined => {
  if (!val) return undefined;
  return val.trim().replace(/^["']|["']$/g, '');
};

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = sanitizeEnvVar(rawUrl);
const supabaseAnonKey = sanitizeEnvVar(rawKey);

const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder')
);

const clientOptions = {
  auth: {
    persistSession: typeof window !== 'undefined' && isConfigured,
    autoRefreshToken: typeof window !== 'undefined' && isConfigured,
    detectSessionInUrl: typeof window !== 'undefined' && isConfigured,
  },
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  if (!isConfigured) {
    if (typeof window !== 'undefined') {
      console.warn('Supabase environment variables are missing or invalid.');
    }
    supabaseInstance = createClient(
      'https://placeholder.supabase.co',
      'placeholder',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
    return supabaseInstance;
  }

  supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, clientOptions);
  return supabaseInstance;
};

// Singleton export
export const supabase = getSupabase();


