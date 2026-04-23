import { supabase } from "@/lib/supabase";

export async function POST(request) {
  const { email, password } = await request.json();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  } else {
    return new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      {
        status: 200,
      },
    );
  }
}
