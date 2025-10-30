import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabaseClient";
import { randomUUID } from "crypto";

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
        { role: "user", content: `Skapa en hemsida baserad på idén:\n\n${prompt}` },
      ],
      max_tokens: 2000,
    });

    let result = completion.choices[0].message?.content || "";
    result = result.replace(/```html|```/g, "").trim();

    // 💾 Spara resultatet i databasen
    const slug = randomUUID(); // unikt id för sidan
    const { error } = await supabase.from("sites").insert([
      {
        slug: slug,
        html: result,
      },
    ]);

    if (error) throw error;

    // Skicka tillbaka URL till preview
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Fel vid AI-generering:", error);
    return NextResponse.json({ error: "Fel vid AI-generering." }, { status: 500 });
  }
}
