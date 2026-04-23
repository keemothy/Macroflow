import { supabase } from "@/lib/supabase";

export async function GET(request) {
  console.log("--- DEBUG START ---");
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("KEY EXISTS?:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log("--- DEBUG END ---");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: "http://localhost:3000/api/auth/callback" },
  });
  if (error) {
    return new Response(error.message, { status: 500 });
  }
  return Response.redirect(data.url);
}
