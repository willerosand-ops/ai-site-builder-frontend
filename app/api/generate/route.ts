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
Skapa en komplett, responsiv HTML-sida baserat på användarens idé.

✨ Krav:
- Använd **mörkt tema** (t.ex. mörk bakgrund och ljus text).
- Texten ska vara lättläst och ha god kontrast.
- Använd Tailwind-klasser för färger, spacing och layout.
- Lägg till snygga sektioner, rubriker, knappar eller kort om det passar.
- Se till att sidan fungerar bra på mobil.
- Skriv **endast HTML** (ingen markdown, inga kommentarer).
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
