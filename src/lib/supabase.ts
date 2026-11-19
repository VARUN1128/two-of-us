import { createClient } from '@supabase/supabase-js';

const nodeEnv = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env || {};
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : nodeEnv;

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
