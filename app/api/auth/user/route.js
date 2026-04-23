import { supabase } from "@/lib/supabase";

export async function GET(request) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  } else {
    return new Response(JSON.stringify({ user }), {
      status: 200,
    });
  }
}
