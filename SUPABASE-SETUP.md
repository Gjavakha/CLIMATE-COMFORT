# Supabase Setup — Climate Comfort

One-time setup, takes about 10 minutes. After this, Claude wires the site to the database.

## 1. Create the project

1. Go to <https://supabase.com> → **Start your project** → sign in (GitHub or Google login is fine).
2. **New project**:
   - Organization: your personal one (created automatically)
   - Name: `AC Website`
   - Database password: generate one and **save it somewhere safe** (you rarely need it, but don't lose it)
   - Region: **Central EU (Frankfurt)** — closest to Georgia
3. Wait ~2 minutes while the project provisions.

## 2. Create the tables

1. In the left sidebar: **SQL Editor** → **New query**.
2. Open the file `supabase-schema.sql` from this project folder, copy ALL of it, paste it into the editor.
3. Press **Run**. You should see "Success. No rows returned".

This creates: `products`, `supplier_offers` (supplier prices incl. your cost — admin-only),
`suppliers` (Elit + Kontakt already seeded), `orders`, `import_batches`, `admin_emails`,
plus security rules so shoppers can only see published products and their own orders.

## 3. Make yourself an admin

1. Sidebar: **Table Editor** → table `admin_emails` → **Insert row**.
2. `email`: `balibegashvili12@gmail.com` (and any other admin emails, one row each).

## 4. Turn on login methods

1. Sidebar: **Authentication** → **Sign In / Up** → Providers.
2. **Email** is on by default — leave it.
3. Optional (recommended, since the site already has Google sign-in): enable **Google**,
   and paste the Client ID and the **Client Secret** from your Google Cloud OAuth client.
   ⚠️ This is the ONE correct place for that client secret — it stays on Supabase's
   server, never in the site code. Google Cloud Console will also ask you to add the
   redirect URL Supabase shows you (looks like
   `https://<project-ref>.supabase.co/auth/v1/callback`) under
   **Authorized redirect URIs**.

## 5. Send Claude the two keys

Sidebar: **Project Settings** (gear) → **API Keys**:

- **Project URL** — looks like `https://abcdefgh.supabase.co`
- **anon / public key** — long string starting with `eyJ...` or `sb_publishable_...`

Paste both into the chat. These two are safe to have in the website code (they are
public by design — the security rules in the schema are what protect the data).
Never share the `service_role` / secret key.
