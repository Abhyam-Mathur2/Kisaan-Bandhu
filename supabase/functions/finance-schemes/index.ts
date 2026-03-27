import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCors, json, error } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== "GET") {
    return error("Method not allowed", 405);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Optional ?state= query param
  const url = new URL(req.url);
  const state = url.searchParams.get("state");

  let query = supabase.from("finance_schemes").select("*");
  if (state) {
    query = query.eq("state", state);
  }

  const { data, error: dbError } = await query;

  if (dbError) {
    return error(`Database error: ${dbError.message}`, 500);
  }

  return json(data ?? []);
});
