import { supabase } from "@/utils/supabase/client";

export async function GET(request) {
  const { origin } = new URL(request.url);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      flowType: "pkce",
    },
  });

  if (error) {
    console.error("OAuth Error:", error.message);
    return new Response(error.message, { status: 500 });
  }

  return Response.redirect(data.url);
}
