"use client";

import { useSearchParams } from "next/navigation";

export default function PreviewClient() {
  const params = useSearchParams();
  const html = params.get("html");

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
