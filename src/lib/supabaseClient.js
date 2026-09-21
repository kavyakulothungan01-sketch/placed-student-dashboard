import { createClient } from '@supabase/supabase-js';

const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : process.env.VITE_SUPABASE_URL;
const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : process.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = envUrl || 'https://fslpzikstscutxfrnxst.supabase.co';
const supabaseAnonKey = envKey || 'sb_publishable_0u-uFjMu-4oyzzG-rVhaHg_07QaW4BQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);