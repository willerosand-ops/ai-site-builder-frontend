// app/preview/[slug]/page.tsx
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

// Skapa Supabase-klient
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// 🧩 Lägg till en explicit typning för att kringgå Next.js typ-bugg
// (params tolkas ibland fel som ett Promise i nya versioner)
type Props = {
  params: { slug: string };
} & Record<string, any>;

export default async function PreviewPage({ params }: Props) {
  const slug = params.slug;

  // 🔹 Hämta HTML från Supabase
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

// Den här raden krävs för dynamiska routes i vissa Next-versioner
export const dynamicParams = true;
