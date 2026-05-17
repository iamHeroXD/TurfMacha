import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard/user";

  // Handle OAuth error from provider (e.g. user denied consent)
  const providerError = searchParams.get("error");
  if (providerError) {
    const desc = searchParams.get("error_description") ?? providerError;
    console.error("OAuth provider error:", desc);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(desc)}`, origin)
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("OAuth exchangeCodeForSession failed:", error.message);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, origin)
      );
    }
    return NextResponse.redirect(new URL(next, origin));
  }

  return NextResponse.redirect(new URL("/login?error=missing_code", origin));
}

