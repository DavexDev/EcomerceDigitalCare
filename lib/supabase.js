import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Cliente mock para desarrollo sin credenciales
const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('tu-proyecto');

const mockClient = {
  from: (table) => ({
    select: (columns, options) => {
      const result = Promise.resolve({ data: [], error: null, count: 0 });
      result.order = () => result;
      result.eq = () => result;
      return result;
    },
    insert: (data) => Promise.resolve({ data: null, error: null }),
    update: (data) => ({
      eq: () => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null }),
    }),
  }),
};

export const supabase = isPlaceholder ? mockClient : createClient(supabaseUrl, supabaseAnonKey);
