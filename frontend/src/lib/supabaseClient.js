import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './stores';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Esempio di funzione per fetch generico (da estendere per CRUD)
export async function fetchTable(table) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) throw error;
  return data;
}
