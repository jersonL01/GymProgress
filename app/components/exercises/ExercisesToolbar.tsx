"use client";

import Link from "next/link";
import type { Category } from "@/app/lib/exercisesCatalog";

type Props = {
  category: Category;
  setCategory: (c: Category) => void;
  q: string;
  setQ: (v: string) => void;
  categories: Category[];
  onNew?: () => void;
};

export default function ExercisesToolbar({
  category,
  setCategory,
  q,
  setQ,
  categories,
  onNew,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" />
            Catálogo
          </div>

          <h2 className="mt-3 text-base font-extrabold text-white">Ejercicios</h2>
          <p className="mt-1 text-sm text-white/70">
            Filtra por categoría o busca por nombre.
          </p>
        </div>

        <div className="grid gap-2 sm:flex sm:items-center">
          <Link
            href="/home"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            ← Inicio
          </Link>

          <button
            type="button"
            onClick={onNew}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(37,99,235,0.35)] transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-white/70">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#0B0F14]">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-white/70">Buscar</label>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 transition focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/15">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-white/50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" />
            </svg>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar ejercicio…"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
            />

            {q.trim() && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}