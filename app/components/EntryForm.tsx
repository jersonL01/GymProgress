"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  exerciseId: string;
};

export default function EntryForm({ exerciseId }: Props) {
  const router = useRouter();

  const [weightKg, setWeightKg] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [sets, setSets] = useState<number>(0);
  const [date, setDate] = useState<string>(() => {
    // YYYY-MM-DD para input date
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setMsg(null);

  if (weightKg <= 0 || reps <= 0 || sets <= 0) {
    setMsg("Completa peso, reps y series (mayores a 0).");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseId,
        date,
        weightKg,
        reps,
        sets,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data?.error ?? "❌ No se pudo guardar.");
      return;
    }

    setMsg("✅ Registro guardado");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="max-w-xl rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-neutral-900">Nuevo registro</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Peso (kg) + repeticiones + series
      </p>

      {msg && (
        <div className="mt-4 rounded-xl border bg-neutral-50 px-4 py-3 text-sm text-neutral-800">
          {msg}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div>
          <label className="text-sm font-semibold text-neutral-800">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-sm font-semibold text-neutral-800">Peso (kg)</label>
            <input
              type="number"
              step="0.5"
              min={0}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-neutral-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-neutral-800">Reps</label>
            <input
              type="number"
              min={0}
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-neutral-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-neutral-800">Series</label>
            <input
              type="number"
              min={0}
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-neutral-400"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar registro"}
        </button>
      </form>
    </div>
  );
}