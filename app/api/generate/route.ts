import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabaseClient";
import { randomUUID } from "crypto";
/* eslint-disable no-console */

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Ingen idé skickades." }, { status: 400 });
    }

    const systemPrompt = `
    Du är en expert på modern webbdesign och använder Tailwind CSS.
    Skapa en komplett HTML-sida baserat på användarens idé.
    Skriv endast HTML (inga kommentarer eller markdown).
    `;

    // 🧠 Generera sidan med OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    const html = completion.choices[0]?.message?.content || "";

    // 💾 Spara i Supabase
    const slug = randomUUID();
    const { error } = await supabase.from("sites").insert([{ html, slug }]);

    if (error) throw error;

    return NextResponse.json({ slug });
  } catch (error) {
    console.error("❌ Fel vid generering:", error);
    return NextResponse.json({ error: "Något gick fel." }, { status: 500 });
  }
}
