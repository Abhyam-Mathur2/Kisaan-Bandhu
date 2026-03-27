import { handleCors, json, error } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== "POST") {
    return error("Method not allowed", 405);
  }

  // Stub — returns a mock disease detection response.
  // Replace with a real CNN model call when available.
  return json({
    status: "success",
    analysis: "Currently processing your leaf image...",
    detected: "Potential Late Blight",
    confidence: 0.89,
    advice: "Apply Copper-based fungicides and remove infected leaves.",
  });
});
