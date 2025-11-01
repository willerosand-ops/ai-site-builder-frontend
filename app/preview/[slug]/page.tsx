import { supabase } from "@/lib/supabaseClient";

// ✅ Fixar Next.js 15-type bug (params tolkades som Promise)
export default async function PreviewPage({ params }: any) {
  const slug = params?.slug;

  // Hämta den genererade sidan från Supabase
  const { data, error } = await supabase
    .from("sites")
    .select("html")
    .eq("slug", slug)
    .single();

  // 🧱 Om ingen sida hittas
  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        <p>Ingen sida hittades för den här länken 😅</p>
      </main>
    );
  }

  // ✅ Rendera den sparade HTML-sidan
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div
        className="prose prose-invert max-w-4xl mx-auto p-8"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </main>
  );
}
