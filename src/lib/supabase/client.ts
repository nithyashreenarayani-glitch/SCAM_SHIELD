import { createClient } from '@supabase/supabase-js';

const rawUrl = (
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL ||
  ''
).trim().replace(/^["']|["']$/g, '');

const rawAnonKey = (
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''
).trim().replace(/^["']|["']$/g, '');

// Clean URL: Strip any subpaths like /rest/v1 or trailing slashes that cause "Invalid path specified in request URL"
export function cleanSupabaseUrl(input: string): string {
  if (!input) return '';
  try {
    let normalized = input.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'https://' + normalized;
    }
    const urlObj = new URL(normalized);
    // Origin only: https://xxxx.supabase.co
    return urlObj.origin;
  } catch {
    return input.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  }
}

const cleanedUrl = cleanSupabaseUrl(rawUrl);

export const isSupabaseConfigured = Boolean(
  cleanedUrl &&
  rawAnonKey &&
  cleanedUrl.startsWith('https://') &&
  !cleanedUrl.includes('your-project.supabase.co')
);

export const supabase = isSupabaseConfigured
  ? createClient(cleanedUrl, rawAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
