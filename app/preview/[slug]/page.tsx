import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function PreviewPage({ params }: PageProps) {
  const slug = params.slug;

  // 🔹 Hämta HTML från Supabase baserat på slug
  const { data, error } = await supabase
    .from("sites")
    .select("html")
    .eq("slug", slug)
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
