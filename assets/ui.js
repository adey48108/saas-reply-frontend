// assets/ui.js
import { supabase, getUser } from "./supabase.js";
import { FN_BASE, PROJECT_REF, GMAIL_SCOPE, MAX_GMAIL } from "./config.js";

export function $(id) { return document.getElementById(id); }

export function showMsg(text, type="") {
  const el = $("msg");
  if (!el) return;
  el.textContent = text || "";
  el.className = "msg" + (type ? " " + type : "");
}

// --- Parse Google client_secret.json (web or installed) ---
export function extractGoogleClient(json) {
  const root = json.web || json.installed || null;
  if (!root) throw new Error("Invalid JSON: expected 'web' or 'installed' object.");

  const client_id = root.client_id;
  const client_secret = root.client_secret;
  const project_id = root.project_id || "";
  const auth_uri = root.auth_uri || "";
  const token_uri = root.token_uri || "";

  if (!client_id || !client_secret) throw new Error("Missing client_id or client_secret in JSON.");

  return { client_id, client_secret, project_id, auth_uri, token_uri };
}

// Save Google OAuth client into your existing table: user_google_oauth
export async function saveGoogleOAuthClient(payload) {
  const user = await getUser();
  if (!user) throw new Error("Not logged in.");

  const row = {
    user_id: user.id,
    client_id: payload.client_id,
    client_secret: payload.client_secret,
    project_id: payload.project_id,
    auth_uri: payload.auth_uri,
    token_uri: payload.token_uri,
  };

  const { error } = await supabase
    .from("user_google_oauth")
    .upsert(row, { onConflict: "user_id" });

  if (error) throw error;
}

// Start Gmail OAuth -> redirect to Google -> callback goes to your Edge function
export async function startGmailConnect() {
  const user = await getUser();
  if (!user) throw new Error("Not logged in.");

  // Read client_id from DB (saved from JSON)
  const { data, error } = await supabase
    .from("user_google_oauth")
    .select("client_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data?.client_id) throw new Error("Upload Google client JSON first.");

  const redirectUri = `${FN_BASE}/gmail-callback`; // your deployed function
  const state = user.id;

  const oauthUrl =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${encodeURIComponent(data.client_id)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(GMAIL_SCOPE)}` +
    `&access_type=offline` +
    `&prompt=consent` +
    `&state=${encodeURIComponent(state)}`;

  window.location.href = oauthUrl;
}

// List connected gmail accounts from your table
export async function loadGmailAccounts() {
  const user = await getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("gmail_accounts")
    .select("id, user_id, gmail_address, token_expiry, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Your existing edge function: deletes Gmail + related tables (ALL for this user)
export async function disconnectAllGmail() {
  const user = await getUser();
  if (!user) throw new Error("Not logged in.");

  const res = await fetch(`${FN_BASE}/gmail-disconnect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.id }),
  });

  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out?.error || res.statusText);
  return out;
}

// Enforce max Gmail
export function enforceMax(count) {
  if (count >= MAX_GMAIL) throw new Error(`Max ${MAX_GMAIL} Gmail accounts reached.`);
}

// ----------------------
// Reply template (per user)
// Table: reply_templates(user_id, reply_text, updated_at)
// ----------------------
export async function loadUserTemplate() {
  const user = await getUser();
  if (!user) throw new Error("Not logged in.");

  const { data, error } = await supabase
    .from("reply_templates")
    .select("reply_text")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data?.reply_text || "";
}

export async function saveUserTemplate(reply_text) {
  const user = await getUser();
  if (!user) throw new Error("Not logged in.");

  const row = {
    user_id: user.id,
    reply_text,
    updated_at: new Date().toISOString(),
  };

  // NOTE: If your table doesn't have a unique constraint on user_id,
  // upsert might fail. If it fails, tell me and I’ll give 2-line fix.
  const { error } = await supabase
    .from("reply_templates")
    .upsert(row, { onConflict: "user_id" });

  if (error) throw error;
}
