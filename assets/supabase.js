// assets/supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function requireAuthOrRedirect() {
  const user = await getUser();
  if (!user) window.location.href = "./index.html";
  return user;
}
