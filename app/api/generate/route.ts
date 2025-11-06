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
    if (!prompt)
      return NextResponse.json(
        { error: "Ingen idé skickades." },
        { status: 400 }
      );

    // 🧠 1️⃣ Analys: få tema + färg från AI
    const themeResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
Du ska analysera användarens idé och svara i JSON-format med två fält:
{
  "keyword": "kort engelskt ord för bildtema",
  "color": "hexkod eller Tailwind-färgklass som matchar stilen"
}
Exempel:
- "kafé" -> {"keyword":"coffee","color":"#b5895a"}
- "byggfirma" -> {"keyword":"construction","color":"#1e3a8a"}
- "yogastudio" -> {"keyword":"yoga","color":"#22c55e"}
- "tech startup" -> {"keyword":"technology","color":"#3b82f6"}
- "modebutik" -> {"keyword":"fashion","color":"#ec4899"}
Svara endast med JSON. Inget extra text, bara JSON.
          `,
        },
        { role: "user", content: prompt },
      ],
    });

    let theme = { keyword: "design", color: "#3b82f6" }; // fallback
    try {
      const parsed = JSON.parse(
        themeResponse.choices[0]?.message?.content || "{}"
      );
      theme = {
        keyword: parsed.keyword || "design",
        color: parsed.color || "#3b82f6",
      };
    } catch {
      console.warn("⚠️ Kunde inte tolka färgdata, använder standardtema.");
    }

    const { keyword, color } = theme;
    console.log("🎨 Valde tema:", keyword, "Accentfärg:", color);

    // 🎨 2️⃣ Skapa HTML med Tailwind + AI
    const systemPrompt = `
Du är en expert på modern webbdesign och använder Tailwind CSS.
Skapa en komplett, responsiv HTML-sida utifrån användarens idé.

✨ Krav:
- Mörkt, professionellt tema
- Använd accentfärgen ${color} för rubriker, knappar och detaljer
- Lägg in relevanta bilder från https://source.unsplash.com/800x600/?${keyword}
- Snygg typografi, gott spacing, konsekvent färgpalett
- Layout ska fungera perfekt på mobil & desktop
- Använd gärna sektioner med titlar, cards eller call-to-action
- Skriv endast HTML (ingen markdown, inga kommentarer)
`;

    const htmlResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    const rawHtml = htmlResponse.choices[0]?.message?.content || "";

    // 💅 3️⃣ Lägg till wrapper, font och animationer
    const html = `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI-genererad sida</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0b1220;
      color: #e5e7eb;
      overflow-x: hidden;
    }
    .fade-in {
      opacity: 0;
      transform: translateY(10px);
      animation: fadeInUp 0.8s ease forwards;
    }
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-8">
  <div class="w-full max-w-4xl bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl border-t-4 p-8 fade-in" style="border-color:${color}">
    ${rawHtml}
  </div>
  <footer class="text-sm text-gray-500 mt-8 fade-in" style="animation-delay: 0.3s">
    Skapad automatiskt av din AI-webbplatsgenerator 🚀
  </footer>
</body>
</html>
`;

    // 💾 4️⃣ Spara i Supabase
    const slug = randomUUID();
    const { error } = await supabase.from("sites").insert([{ html, slug }]);
    if (error) throw error;

    console.log("✅ Sida sparad i Supabase:", slug);
    return NextResponse.json({ slug });
  } catch (error) {
    console.error("❌ Fel vid generering:", error);
    return NextResponse.json(
      { error: "Något gick fel vid generering eller sparning." },
      { status: 500 }
    );
  }
}
