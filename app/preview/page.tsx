import dynamic from "next/dynamic";

// 🧠 Importera client-komponenten utan SSR (server-rendering)
const PreviewClient = dynamic(() => import("./PreviewClient"), { ssr: false });

export const dynamicParams = true; // tillåter dynamiska routes
export const revalidate = 0;       // ingen cache

export default function PreviewPage() {
  return <PreviewClient />;
}
