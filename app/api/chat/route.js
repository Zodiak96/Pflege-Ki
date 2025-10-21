import { NextResponse } from "next/server";

export const runtime = "edge"; // schnell & günstig

export async function POST(req) {
  const { messages = [], profile = {} } = await req.json();

  const system =
    "Du bist ein Pflege-KI-Assistent (DE). Keine Diagnosen, kein Ersatz für ärztliche Behandlung. " +
    "Gib klare, kurze Pflege-Hinweise in Stichpunkten. DSGVO: keine personenbezogenen Daten.";

  const body = {
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [{ role: "system", content: system }, ...messages],
  };

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const err = await r.text();
    return NextResponse.json({ reply: `Fehler: ${err}` }, { status: 500 });
  }

  const data = await r.json();
  const reply = data?.choices?.[0]?.message?.content || "";
  return NextResponse.json({ reply });
}
