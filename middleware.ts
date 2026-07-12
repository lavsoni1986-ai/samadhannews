import { createClient as createSupabaseClient } from "@/utils/supabase/middleware";
import { type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return createSupabaseClient(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
