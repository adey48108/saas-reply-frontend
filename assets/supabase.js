// assets/supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { https://dfxigbxlaezezgozylxn.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeGlnYnhsYWV6ZXpnb3p5bHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzcwNzAsImV4cCI6MjA4MTIxMzA3MH0.MRf2tyClYszRkZkGveS7lcBCyfdJff5l2fW3wbMcNZk } from "./config.js";

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
