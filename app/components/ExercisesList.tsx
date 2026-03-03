"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ExercisesToolbar from "@/app/components/exercises/ExercisesToolbar";
import {
  CATEGORIES,
  EXERCISES_CATALOG,
  filterExercises,
  type Category,
} from "@/app/lib/exercisesCatalog";

export default function ExercisesList() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category>("Todos");

  const filtered = useMemo(() => {
    return filterExercises(EXERCISES_CATALOG, category, q);
  }, [category, q]);

  return (
    <div className="grid gap-4">
      <ExercisesToolbar
        category={category}
        setCategory={setCategory}
        q={q}
        setQ={setQ}
        categories={CATEGORIES}
        onNew={() => alert("Luego lo conectamos para crear ejercicios 😉")}
      />

      {/* Lista */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <p className="text-sm font-extrabold text-white">
            Resultados{" "}
            <span className="text-white/60 font-semibold">({filtered.length})</span>
          </p>

          <span className="hidden sm:inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/60">
            Tip: toca uno para registrar
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {filtered.map((e) => (
            <Link
              key={e.id}
              href={`/entries/${e.id}?catalogId=${e.catalogId}&name=${encodeURIComponent(
                e.name
              )}&cat=${encodeURIComponent(e.category)}`}
              className="group rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-white/[0.06] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-white">{e.name}</p>
                  <p className="mt-1 text-xs font-semibold text-white/50">
                    {e.category} • catalogId: {e.catalogId}
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition group-hover:bg-white/10">
                  Registrar →
                </span>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-6 text-sm text-white/70">
              No se encontraron ejercicios.
              <div className="mt-2 text-xs text-white/45">
                Prueba cambiando la categoría o el texto de búsqueda.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}