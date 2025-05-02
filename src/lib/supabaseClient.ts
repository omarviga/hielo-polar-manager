import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ""; // Reemplaza con tu variable de entorno
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || ""; // Reemplaza con tu variable de entorno

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL o Key no están configurados en las variables de entorno.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);