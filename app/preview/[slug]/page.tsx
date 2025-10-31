import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic"; // 🧠 hindrar statisk build
export const fetchCache = "force-no-store"; // 🔄 alltid färska data

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = params;

  // 🔹 Hämta HTML från Supabase baserat på slug
  const { data, error } = await supabase
    .from("sites")
    .select("html")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Fel vid hämtning från Supabase:", error);
    notFound();
  }

  // 🔹 Rendera HTML-innehållet
  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div
        className="prose prose-invert max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </div>
  );
}
