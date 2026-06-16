import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// Browser-side Supabase client — use in Client Components only.
// Session cookies are managed automatically by the middleware.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
