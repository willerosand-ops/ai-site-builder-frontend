"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PreviewContent() {
  const searchParams = useSearchParams();
  const html = searchParams.get("html") || "<p>Ingen data hittades.</p>";

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div
        className="prose prose-invert max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Laddar förhandsvisning...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
