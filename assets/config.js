// assets/config.js
export const PROJECT_REF = "dfxigbxlaezezgozylxn";
export const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

// ✅ Paste your anon key here (Project Settings → API → anon public)
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeGlnYnhsYWV6ZXpnb3p5bHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzcwNzAsImV4cCI6MjA4MTIxMzA3MH0.MRf2tyClYszRkZkGveS7lcBCyfdJff5l2fW3wbMcNZk";

// Edge Functions base:
export const FN_BASE = `${SUPABASE_URL}/functions/v1`;

// Gmail scope:
export const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.modify";

// Limit
export const MAX_GMAIL = 10;
