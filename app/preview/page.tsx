"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const PreviewClient = dynamic(() => import("./PreviewClient"), { ssr: false });

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Laddar...</div>}>
      <PreviewClient />
    </Suspense>
  );
}
