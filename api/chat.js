import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { messages } = req.body;
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
    });

    res.status(200).json({ reply: response.choices[0]?.message?.content || "" });
  } catch (e) {
    res.status(500).send(e.message);
  }
}
