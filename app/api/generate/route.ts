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
      return NextResponse.json(
        { error: "Ingen idé skickades." },
        { status: 400 }
      );
    }

    // 🧠 AI-instruktion (mörkt tema + modern design)
    const systemPrompt = `
Du är en expert på modern webbdesign och använder Tailwind CSS.
Skapa en komplett, responsiv HTML-sida baserat på användarens idé.

✨ Krav:
- Använd mörkt tema (mörk bakgrund och ljus text)
- Texten ska vara lättläst och ha god kontrast
- Använd Tailwind-klasser för färger, spacing och layout
- Lägg till snygga sektioner, rubriker, knappar eller kort om det passar
- Se till att sidan fungerar bra på mobil
- Skriv endast HTML (inga kommentarer eller markdown)
`;

    // ⚙️ Generera HTML med OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    const rawHtml = completion.choices[0]?.message?.content || "";

    // 🎨 Lägg till wrapper för mörkt tema & centrering
    const wrapperStart = `
      <div class="min-h-screen bg-[#0b1220] text-gray-100 flex flex-col items-center justify-center p-8">
        <div class="w-full max-w-4xl bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-lg p-8 prose prose-invert">
    `;
    const wrapperEnd = `
        </div>
      </div>
    `;

    const html = `${wrapperStart}${rawHtml}${wrapperEnd}`;

    // 💾 Spara sidan i Supabase
    const slug = randomUUID();
    const { error } = await supabase.from("sites").insert([{ html, slug }]);

    if (error) throw error;

    console.log("✅ Sida sparad i Supabase med slug:", slug);
    return NextResponse.json({ slug });
  } catch (error) {
    console.error("❌ Fel vid generering:", error);
    return NextResponse.json(
      { error: "Något gick fel vid generering eller sparning." },
      { status: 500 }
    );
  }
}
