"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// 🧠 Hindrar Next.js från att försöka generera statiskt
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export async function generateStaticParams() {
  return [];
}

// 🧩 Lazy-loada PreviewClient (helt client-side)
const PreviewClient = dynamic(() => import("./PreviewClient"), {
  ssr: false,
});

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Laddar förhandsvisning...</div>}>
      <PreviewClient />
    </Suspense>
  );
}
