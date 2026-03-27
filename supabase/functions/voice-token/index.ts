import { handleCors, json, error } from "../_shared/cors.ts";

const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY")!;
const ELEVENLABS_AGENT_ID =
  Deno.env.get("ELEVENLABS_AGENT_ID") ?? "agent_8401kmrag3adf5qv4gc619bwe4qq";

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== "GET") {
    return error("Method not allowed", 405);
  }

  if (!ELEVENLABS_API_KEY) {
    return error("ElevenLabs API key not configured", 500);
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${ELEVENLABS_AGENT_ID}`,
      { headers: { "xi-api-key": ELEVENLABS_API_KEY } }
    );

    if (!res.ok) {
      const text = await res.text();
      return error(`ElevenLabs error: ${text}`, res.status);
    }

    const data = await res.json();
    return json(data);
  } catch (e) {
    return error(`Could not reach ElevenLabs: ${String(e)}`, 503);
  }
});
