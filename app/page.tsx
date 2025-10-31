"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      setError("⚠️ Skriv in en idé först!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: idea }),
      });

      if (!res.ok) throw new Error("Fel vid generering");

      const data = await res.json();

      if (data.slug) {
        // ✅ Skicka användaren till rätt förhandsvisningssida
        router.push(`/preview/${data.slug}`);
      } else {
        throw new Error("Ingen slug returnerades från servern");
      }
    } catch (err) {
      console.error(err);
      setError("Något gick fel! Kontrollera API:et eller försök igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-8">
      {/* 🔵 Progress-bar högst upp */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-indigo-600 animate-[progress_2s_linear_infinite]" />
      )}

      <h1 className="text-3xl font-bold mb-4 text-blue-400">
        AI-hemsidesgenerator
      </h1>
      <p className="text-gray-400 mb-6">
        Beskriv din idé så bygger AI en sida på sekunder ✨
      </p>

      <textarea
        className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-lg p-3 text-white mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
        rows={4}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Ex: En sida för mitt café med öppettider och kontakt"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`${
          loading
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        } text-white font-semibold px-6 py-3 rounded-lg transition`}
      >
        {loading ? "AI bygger din sida..." : "🚀 Skapa sida"}
      </button>

      {loading && (
        <div className="mt-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-70"></div>
          <p className="mt-3 text-gray-400 italic">AI tänker ut din design 🔮</p>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </main>
  );
}
