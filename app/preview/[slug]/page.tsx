import { supabase } from "@/lib/supabaseClient";

export default async function PreviewPage({ params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from("sites")
    .select("html")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-300">
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
