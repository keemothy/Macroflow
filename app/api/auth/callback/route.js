import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // Exchange the code for a session using your existing client
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange Error:", error.message);
      return new Response(`Auth error: ${error.message}`, { status: 400 });
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
