import { createClient } from "@/lib/db/server";
import { NextResponse } from "next/server";

// Handles both email-confirmation links and OAuth provider redirects.
// Supabase sends ?code=... which must be exchanged for a session.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app/projects";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Use the configured app URL if available to avoid open redirects
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? origin;
      return NextResponse.redirect(`${appUrl}${next}`);
    }
  }

  // Something went wrong — send to login with a visible error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
