import { createClient, SupabaseClient } from '@supabase/supabase-js';

const sanitizeEnvVar = (val: string | undefined): string | undefined => {
  if (!val) return undefined;
  return val.trim().replace(/^["']|["']$/g, '');
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  const rawUrl = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined;
  const rawKey = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined;

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

// Lazy Proxy export so createClient is only called on runtime usage
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabase();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
