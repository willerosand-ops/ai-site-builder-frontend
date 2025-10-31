"use client";

import { Suspense } from "react";
import loadable from "next/dynamic";

// 🧩 Stoppa static generation helt
export async function generateStaticParams() {
  return [];
}

const PreviewClient = loadable(() => import("./PreviewClient"), { ssr: false });

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Laddar förhandsvisning...</div>}>
      <PreviewClient />
    </Suspense>
  );
}
