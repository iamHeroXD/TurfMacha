import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_ROUTES = ["/dashboard", "/admin"];
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];
const PUBLIC_PASSTHROUGH = ["/auth/callback"];

// Security headers applied to every response
const SECURITY_HEADERS: Record<string, string> = {
  "X-DNS-Prefetch-Control": "on",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
  // HSTS: 2 years, include subdomains, allow preload
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() validates the JWT server-side — not just decoding the token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Let OAuth callback through without any redirect logic
  if (PUBLIC_PASSTHROUGH.some((route) => pathname.startsWith(route))) {
    return applySecurityHeaders(supabaseResponse);
  }

  // Redirect unauthenticated users from protected routes to login
  if (!user && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // Redirect authenticated users away from auth pages
  // NOTE: We do NOT perform role-based routing in middleware because user_metadata
  // (which is user-controlled at signup) should never be trusted for access control.
  // Role-based access is enforced at the layout/page level via server-side DB checks.
  if (user && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL("/dashboard/user", request.url))
    );
  }

  return applySecurityHeaders(supabaseResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|workbox-|offline|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
