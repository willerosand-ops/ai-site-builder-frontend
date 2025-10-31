"use client";

import { Suspense } from "react";
import loadable from "next/dynamic"; // 👈 byter namn på importen för att undvika konflikt

// ✅ Lazy-ladda PreviewClient – och markera sidan som dynamic
const PreviewClient = loadable(() => import("./PreviewClient"), { ssr: false });

export const dynamic = "force-dynamic"; // 🧠 hindrar Next från att bygga statiskt
export const fetchCache = "force-no-store"; // försäkrar att inget cachas

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Laddar förhandsvisning...</div>}>
      <PreviewClient />
    </Suspense>
  );
}
