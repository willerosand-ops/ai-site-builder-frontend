"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PreviewContent() {
  const searchParams = useSearchParams();
  const html = searchParams.get("html");

  if (!html) {
    return <div className="text-gray-400 p-10">Ingen förhandsvisning att visa.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div
        className="prose prose-invert max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: decodeURIComponent(html) }}
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
