// filepath: c:\Users\oviey\Documents\hielo-polar-manager\src\lib\supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL o Key no están configurados en las variables de entorno.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);