import { supabase } from "@/lib/supabase";

export async function POST(request) {
  const { email, password } = await request.json();

  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  } else {
    return new Response(JSON.stringify({ user }), { status: 201 });
  }
}
