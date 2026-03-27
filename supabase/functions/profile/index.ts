import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCors, json, error } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== "GET") {
    return error("Method not allowed", 405);
  }

  // Extract user_id from URL path: /profile/<user_id>
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const userId = pathParts[pathParts.length - 1];

  if (!userId || userId === "profile") {
    return error("user_id is required. Use /profile/<user_id>", 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error: dbError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (dbError) {
    return error(`Database error: ${dbError.message}`, 500);
  }

  if (!data) {
    return error("Profile not found", 404);
  }

  return json(data);
});
