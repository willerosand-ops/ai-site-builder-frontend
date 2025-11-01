import { supabase } from "@/lib/supabaseClient";

interface PreviewPageProps {
  params: { slug: string };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = params;

  // 🔍 Hämta rätt rad från Supabase
  const { data, error } = await supabase
    .from("sites")
    .select("html")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("❌ Supabase-fel:", error);
  }

  if (!data?.html) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        <p>Ingen sida hittades för den här länken 😅</p>
      </main>
    );
  }

  // ✅ Visa HTML:en
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <div
        className="prose prose-invert max-w-4xl mx-auto p-8"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </main>
  );
}
