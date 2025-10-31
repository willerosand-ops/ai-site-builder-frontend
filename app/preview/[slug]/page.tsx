import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PreviewPage({ params }: Props) {
  const resolved = await params; // 👈 Vänta in params ifall det är ett Promise

  const { data, error } = await supabase
    .from("sites")
    .select("html")
    .eq("slug", resolved.slug)
    .single();

  if (error || !data) {
    console.error("Fel vid hämtning:", error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div
        className="prose prose-invert max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </div>
  );
}
