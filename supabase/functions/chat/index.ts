import { handleCors, json, error } from "../_shared/cors.ts";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY")!;
const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

const BANDHU_SYSTEM_PROMPT = `You are 'Bandhu', a calm, composed, and highly knowledgeable agricultural assistant.
Your goal is to help Indian farmers with resilient farming practices, weather insights, crop recommendations, and government schemes.
Speak in a friendly, brotherly tone. Support Hindi, English, and other regional languages.
Keep responses concise and actionable.`;

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== "POST") {
    return error("Method not allowed", 405);
  }

  let body: { messages: Array<{ role: string; content: string }> };
  try {
    body = await req.json();
  } catch {
    return error("Invalid JSON body", 400);
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return error("messages array is required", 400);
  }

  const groqMessages = [
    { role: "system", content: BANDHU_SYSTEM_PROMPT },
    ...body.messages,
  ];

  let lastError: string | null = null;

  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: groqMessages,
          temperature: 0.6,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = `${model}: ${errText}`;
        continue;
      }

      const data = await res.json();
      return json({
        response: data.choices[0].message.content,
        model_used: model,
      });
    } catch (e) {
      lastError = String(e);
      continue;
    }
  }

  return error(`Bandhu is currently unavailable. ${lastError}`, 503);
});
