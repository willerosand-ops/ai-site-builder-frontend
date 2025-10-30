// app/preview/[slug]/page.tsx
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

// Skapa Supabase-klient
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// 🔹 Vi berättar tydligt för TypeScript att params har en slug
export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // Hämta HTML från Supabase
  const { data, error } = await supabase
    .from("sites")
    .select("html")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Fel vid hämtning:", error);
    notFound();
  }

  // Visa HTML som riktig sida
  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div
        className="prose prose-invert max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </div>
  );
}

// 🧠 Lägg till denna — Next kräver den i app router för dynamiska routes
export const dynamicParams = true;
