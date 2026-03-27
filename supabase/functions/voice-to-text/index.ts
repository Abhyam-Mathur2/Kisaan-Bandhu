import { handleCors, json, error } from "../_shared/cors.ts";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY")!;

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== "POST") {
    return error("Method not allowed", 405);
  }

  try {
    // Forward the multipart/form-data directly to Groq's transcription endpoint
    const formData = await req.formData();
    const audioFile = formData.get("file");

    if (!audioFile || !(audioFile instanceof File)) {
      return error("No audio file provided (field name: 'file')", 400);
    }

    // Build a new FormData for Groq
    const groqForm = new FormData();
    groqForm.append("file", audioFile, audioFile.name || "audio.wav");
    groqForm.append("model", "whisper-large-v3");
    groqForm.append("response_format", "json");

    const res = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}` },
        body: groqForm,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return error(`Groq Whisper error: ${errText}`, res.status);
    }

    const data = await res.json();
    return json({ text: data.text });
  } catch (e) {
    return error(`Transcription failed: ${String(e)}`, 500);
  }
});
