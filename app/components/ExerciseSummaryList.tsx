"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Row = {
  id: string;
  name: string;
  category: string | null;
  total: number;
  bestWeight: number | null;
  best1RM: number | null;
  last: null | {
    date: string;
    weightKg: number;
    reps: number;
    sets: number;
    est1RM: number;
  };
};

export default function ExerciseSummaryList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/dashboard", { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (res.ok) setRows(json.perExercise ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-sm text-white/70 backdrop-blur-xl">
        Cargando resumen…
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-sm text-white/70 backdrop-blur-xl">
        Aún no tienes ejercicios con registros.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-white">Resumen por ejercicio</h3>
        <span className="text-xs text-white/50">Top {Math.min(8, rows.length)}</span>
      </div>

      <div className="mt-3 grid gap-2">
        {rows.slice(0, 8).map((r) => (
          <Link
            key={r.id}
            href={`/progres/ejercicio/${r.id}`}
            className="rounded-xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-white">{r.name}</p>
                <p className="mt-1 text-xs text-white/60">
                  {r.category ?? "Sin categoría"} • {r.total} registros
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-white/50">Mejor 1RM</p>
                <p className="text-sm font-extrabold text-white">
                  {r.best1RM != null ? `${Math.round(r.best1RM)} kg` : "—"}
                </p>
              </div>
            </div>

            {r.last && (
              <p className="mt-2 text-xs text-white/60">
                Último: {r.last.weightKg} kg × {r.last.reps} (sets {r.last.sets}) • 1RM est{" "}
                {Math.round(r.last.est1RM)} kg
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}