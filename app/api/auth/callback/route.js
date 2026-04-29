import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    if (error) {
      console.error("Exchange Error:", error.message);
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      return new Response(`Auth error: ${error.message}`, { status: 400 });
    }
  }
  return NextResponse.redirect(requestUrl.origin);
}
