/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { supabase } from "@/lib/supabaseClient";

// ⛑️ Typfix: använd `any` för params tills Next typdefinitioner uppdateras
/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function PreviewPage({ params }: { params: any }) {
  const slug = params.slug as string;

  console.log("🪄 Laddar slug:", slug);

  const { data, error } = await supabase
    .from("sites")
    .select("html")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("❌ Supabase-fel:", error.message);
  }

  if (!data?.html) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        <p>Ingen sida hittades för den här länken 😅</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <div
        className="prose prose-invert max-w-4xl mx-auto p-8"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </main>
  );
}
