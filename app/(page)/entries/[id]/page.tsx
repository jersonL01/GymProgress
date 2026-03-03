"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

export default function EntryCreatePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sp = useSearchParams();

  const slug = params.id;

  const catalogId = useMemo(() => Number(sp.get("catalogId")), [sp]);
  const name = sp.get("name") ?? slug;
  const category = sp.get("cat");

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    const w = Number(weightKg);
    const r = Number(reps);
    const s = Number(sets);

    if (!Number.isFinite(catalogId) || catalogId <= 0) return setErr("ID inválido");
    if (!name.trim()) return setErr("Falta nombre del ejercicio");
    if (!Number.isFinite(w)) return setErr("Peso inválido");
    if (!Number.isInteger(r) || r <= 0) return setErr("Reps inválidas");
    if (!Number.isInteger(s) || s <= 0) return setErr("Sets inválidos");

    setLoading(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          catalogId,
          name,
          category,
          date: new Date(date).toISOString(),
          weightKg: w,
          reps: r,
          sets: s,
          notes: notes.trim() ? notes.trim() : null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Error al guardar");

      setOk("✅ Guardado");
      router.push("/ejercicio");
      router.refresh();
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0F14] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.10),transparent_40%)]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" />
                Registrar
              </div>

              <h1 className="mt-3 text-xl font-extrabold tracking-tight sm:text-2xl">
                Registrar entrenamiento
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/90">
                  {name}
                </span>
                {category ? (
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white/70">
                    {category}
                  </span>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20 sm:w-auto"
            >
              ← Volver
            </button>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {err && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {err}
            </div>
          )}
          {ok && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              {ok}
            </div>
          )}

          <form onSubmit={onSubmit} className="grid gap-4">
            {/* Fecha */}
            <div>
              <label className="text-xs font-semibold text-white/70">Fecha</label>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 transition focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/15">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 2v3" />
                  <path d="M16 2v3" />
                  <path d="M3 9h18" />
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                </svg>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
            </div>

            {/* Peso/Reps/Sets */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-white/70">Peso (kg)</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 transition focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 7h12" />
                    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <rect x="4" y="7" width="16" height="14" rx="2" />
                  </svg>
                  <input
                    inputMode="decimal"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="60"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70">Reps</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 transition focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 7h10" />
                    <path d="M7 12h6" />
                    <path d="M7 17h8" />
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                  </svg>
                  <input
                    inputMode="numeric"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="10"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70">Sets</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 transition focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </svg>
                  <input
                    inputMode="numeric"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    placeholder="4"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="text-xs font-semibold text-white/70">Notas (opcional)</label>
              <div className="mt-1 rounded-xl border border-white/10 bg-black/20 p-2 transition focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/15">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: última serie al fallo..."
                  rows={3}
                  className="w-full resize-none bg-transparent px-1 text-sm text-white placeholder:text-white/40 outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-white/45">
                Tip: anota RPE, descanso o cómo te sentiste.
              </p>
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(37,99,235,0.35)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
            >
              <span className="relative z-10">
                {loading ? "Guardando..." : "Guardar"}
              </span>
              <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <span className="absolute -left-24 top-0 h-full w-24 skew-x-[-20deg] bg-white/20 blur-md animate-[shine_1.2s_ease-in-out_infinite]" />
              </span>
            </button>
          </form>
        </div>
      </section>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-140%);
          }
          100% {
            transform: translateX(520%);
          }
        }
      `}</style>
    </main>
  );
}