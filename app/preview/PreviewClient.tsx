"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PreviewContent() {
  const searchParams = useSearchParams();
  const html = searchParams.get("html");
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (html) setContent(decodeURIComponent(html));
  }, [html]);

  if (!content) {
    return <div className="text-gray-300 p-10">Ingen förhandsvisning att visa ännu.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div
        className="prose prose-invert max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default function PreviewClient() {
  return (
    <Suspense fallback={<div className="text-white p-10">Laddar förhandsvisning...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
