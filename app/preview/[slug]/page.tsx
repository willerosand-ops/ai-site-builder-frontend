export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
/* eslint-disable no-console */

import { createClient } from "@supabase/supabase-js";

export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  console.log("🪄 Förhandsvisar slug:", slug);

  // 🧩 Skapa Supabase-klient direkt i funktionen
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Saknas env-variabler i Vercel!");
    return (
      <main className="min-h-screen flex items-center justify-center text-red-400">
        <p>Fel: Supabase-variabler saknas i servern ⚠️</p>
      </main>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("sites")
    .select("html")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("❌ Supabase-fel:", error.message);
  }

  if (!data?.html) {
    console.warn("⚠️ Ingen sida hittades för slug:", slug);
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        <p>Ingen sida hittades för den här länken 😅</p>
      </main>
    );
  }

  console.log("✅ Sida hittad och laddad!");
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <div
        className="prose prose-invert max-w-4xl mx-auto p-8"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </main>
  );
}
