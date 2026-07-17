import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Creates a Supabase client and syncs authentication cookies.
 * Refreshes tokens on-demand and catches stale token loops.
 */
export async function createClient(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Skip execution if credentials are not configured
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder-project")) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          } catch {
            // Can be ignored if called during Server Component execution
          }
        },
      },
    },
  );

  try {
    // Refresh token if necessary by requesting getUser
    await supabase.auth.getUser();
  } catch (error) {
    console.warn("Supabase auth session refresh failed in middleware:", error);
    // Stale/invalid token refresh requests can throw 400 Bad Request error loops.
    // Gracefully clear Supabase session cookies to break the loop.
    try {
      request.cookies.getAll().forEach((cookie) => {
        if (cookie.name.startsWith("sb-") || cookie.name.includes("supabase")) {
          supabaseResponse.cookies.set(cookie.name, "", { maxAge: 0 });
        }
      });
    } catch (cookieResetError) {
      console.error("Failed to reset stale Supabase cookies:", cookieResetError);
    }
  }

  return supabaseResponse;
}
