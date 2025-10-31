"use client";

import React, { Suspense } from "react";

// 🚫 Stoppar Next.js från att försöka SSR-rendera sidan
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "edge"; // extra säkerhet

// 🔹 Lazy-ladda PreviewClient (så körs den 100% på klienten)
const PreviewClient = React.lazy(() => import("./PreviewClient"));

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Laddar förhandsvisning...</div>}>
      <PreviewClient />
    </Suspense>
  );
}
