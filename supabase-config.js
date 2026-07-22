// ============================================================================
// Supabase connection — Climate Comfort
// The URL and anon key are PUBLIC by design (they identify the project; the
// Row Level Security policies in supabase-schema.sql are what protect data).
// The service_role/secret key must NEVER appear here.
// ============================================================================
const SUPABASE_URL = "https://ryhucjksnvkipszssvjb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHVjamtzbnZraXBzenNzdmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MTM5NzAsImV4cCI6MjEwMDI4OTk3MH0.2qGI7badsxOFex48mkymwfEOMMJnLNFs9Gt63Erd_l0";

// The supabase-js CDN script defines window.supabase. If it failed to load
// (offline dev), sbClient stays null and the site falls back to the built-in
// demo catalog and browser-only orders.
const sbClient = (typeof supabase !== "undefined")
    ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
