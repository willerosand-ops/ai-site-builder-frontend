"use client";

import { useSearchParams } from "next/navigation";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {/* NAVBAR */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-xl font-bold text-blue-400">AI-Web</h1>
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition"
          >
            🏠 Ny sida
          </a>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        {data ? (
          <>
            {/* Förhandsvisning av genererad HTML */}
            <div
              className="prose prose-invert prose-h1:text-blue-300 prose-h2:text-blue-200 prose-p:text-gray-200 prose-a:text-blue-400"
              dangerouslySetInnerHTML={{
                __html: `<div class="bg-gray-900 rounded-2xl shadow-xl p-10 space-y-8">
                  ${data.replace(/\n/g, "<br />")}
                </div>`,
              }}
            />

            {/* 💾 Knappen för att spara sidan */}
            <button
              onClick={() => {
                if (!data) return;
                const slug = prompt(
                  "Ange ett kort namn för sidan (t.ex. 'cafeet' eller 'min-sida'):"
                );
                if (!slug) return;

                localStorage.setItem(`page-${slug}`, data);
                alert(`✅ Sidan sparad! Du kan öppna den på /preview/${slug}`);
              }}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              💾 Spara & skapa länk
            </button>
          </>
        ) : (
          <p className="text-center text-gray-400 mt-20">
            Ingen data att visa. Gå tillbaka till startsidan och skapa en idé!
          </p>
        )}
      </section>

      {/* CTA-SEKTION */}
      <section className="bg-blue-900/20 border-t border-gray-800 py-16 text-center">
        <h2 className="text-3xl font-semibold text-blue-300 mb-4">
          Vill du skapa fler sidor?
        </h2>
        <p className="text-gray-400 mb-6">
          Testa en ny idé och se hur AI bygger din nästa sida på sekunder!
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition"
        >
          ✨ Skapa ny sida
        </a>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-16 py-6 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} AI-hemsidesgenerator 🚀 Byggd med ❤️ av
          Wille
        </p>
      </footer>
    </main>
  );
}
