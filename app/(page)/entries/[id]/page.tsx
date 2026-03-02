"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

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

  
  async function onSubmit(e: React.FormEvent) {
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
        credentials: "include", // ✅ CLAVE para evitar 401
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
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-2xl px-4 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
                Registrar entrenamiento
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                {name} {category ? <span className="text-neutral-500">· {category}</span> : null}
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50"
            >
              ← Volver
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          {err && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
              {err}
            </div>
          )}
          {ok && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              {ok}
            </div>
          )}

          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700">Peso (kg)</label>
                <input
                  inputMode="decimal"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="60"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700">Reps</label>
                <input
                  inputMode="numeric"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="10"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700">Sets</label>
                <input
                  inputMode="numeric"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="4"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700">Notas (opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: última serie al fallo..."
                rows={3}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />
            </div>

            <button
              disabled={loading}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}