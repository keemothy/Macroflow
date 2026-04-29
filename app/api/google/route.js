import { supabase } from "@/lib/supabase";

export async function GET(request) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) {
    return new Response(error.message, { status: 500 });
  }
  return Response.redirect(data.url);
}
