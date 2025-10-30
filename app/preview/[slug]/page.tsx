import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

// Skapa Supabase-klient
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

interface PreviewPageProps {
  params: {
    slug: string;
  };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  // 🔹 Hämta HTML från Supabase baserat på slug
  const { data, error } = await supabase
    .from("sites")
    .select("html")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    console.error("Fel vid hämtning:", error);
    notFound();
  }

  // 🔹 Visa HTML som en riktig sida
  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div
        className="prose prose-invert max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </div>
  );
}
