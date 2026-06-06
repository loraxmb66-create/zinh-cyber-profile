import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxwkrwighbdfiglfawcb.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4d2tyd2lnaGJkZmlnbGZhd2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTg0ODAsImV4cCI6MjA5NjMzNDQ4MH0.4iIe7PuHyOjrIVWrrhWeIvzu-XikrTB9hu4XOXR_u98';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' })
  }
});
