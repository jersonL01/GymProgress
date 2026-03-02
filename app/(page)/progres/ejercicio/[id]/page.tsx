"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BtnDelete from "@/app/components/BtnDelete";

type EntryRow = {
  id: string;
  date: string;
  weightKg: number;
  reps: number;
  sets: number;
  notes: string | null;
};

type ExercisePayload = {
  id: string; // Exercise.id (Prisma)
  name: string;
  category: string | null;
  catalogId: number;
  entries: EntryRow[];
};

export default function VerRegistrosPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const exerciseId = params.id;

  const [data, setData] = useState<ExercisePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Modal editar
  const [editing, setEditing] = useState<EntryRow | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editReps, setEditReps] = useState("");
  const [editSets, setEditSets] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/progress/ejercicio/${exerciseId}`, {
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Error cargando registros");
      setData(json);
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseId]);

  const stats = useMemo(() => {
    const entries = data?.entries ?? [];
    const total = entries.length;

    const bestWeight =
      total > 0 ? Math.max(...entries.map((e) => Number(e.weightKg))) : null;

    const last = total > 0 ? entries[0] : null;
    const lastDate = last ? new Date(last.date).toLocaleDateString("es-CL") : "-";

    return { total, bestWeight, lastDate, last };
  }, [data]);

  const registerHref = useMemo(() => {
    if (!data) return "/entries";
    return `/entries/${data.id}?catalogId=${data.catalogId}&name=${encodeURIComponent(
      data.name
    )}&cat=${encodeURIComponent(data.category ?? "Sin categoría")}`;
  }, [data]);

  async function onDelete(entryId: string) {
    if (!confirm("¿Eliminar este registro?")) return;

    const res = await fetch(`/api/entries/${entryId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(json?.error ?? "No se pudo eliminar");
      return;
    }
    await load();
  }

  function openEdit(row: EntryRow) {
    setEditing(row);
    setEditDate(new Date(row.date).toISOString().slice(0, 10));
    setEditWeight(String(row.weightKg));
    setEditReps(String(row.reps));
    setEditSets(String(row.sets));
    setEditNotes(row.notes ?? "");
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    const payload = {
      date: new Date(editDate).toISOString(),
      weightKg: Number(editWeight),
      reps: Number(editReps),
      sets: Number(editSets),
      notes: editNotes.trim() ? editNotes.trim() : null,
    };

    setSaving(true);
    try {
      const res = await fetch(`/api/entries/${editing.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "No se pudo editar");

      setEditing(null);
      await load();
    } catch (e: any) {
      alert(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
                Registros
              </h1>

              {data ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border bg-white px-3 py-1 text-xs font-bold text-neutral-900">
                    {data.name}
                  </span>
                  <span className="rounded-full border bg-neutral-50 px-3 py-1 text-xs font-bold text-neutral-700">
                    {data.category ?? "Sin categoría"}
                  </span>
                  <span className="rounded-full border bg-neutral-50 px-3 py-1 text-xs font-bold text-neutral-700">
                    catalogId: {data.catalogId}
                  </span>
                </div>
              ) : (
                <p className="mt-1 text-sm text-neutral-600">Cargando…</p>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                href="/progres"
                className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
              >
                ← Progreso
              </Link>

              <Link
                href={registerHref}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
              >
                + Registrar
              </Link>
              <BtnDelete
                endpoint={data ? `/api/exercises/${data.id}` : "/api/exercises/0"}
                label="Eliminar ejercicio"
                confirmText={data ? `¿Eliminar "${data.name}" y TODOS sus registros?` : "¿Eliminar ejercicio?"}
                redirectTo="/progres"
                className={!data ? "hidden" : ""}
                />
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {/* Estados */}
        {loading ? (
          <div className="rounded-2xl border bg-white p-5 text-sm font-semibold text-neutral-700 shadow-sm">
            Cargando…
          </div>
        ) : err ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 shadow-sm">
            {err}
          </div>
        ) : !data ? (
          <div className="rounded-2xl border bg-white p-5 text-sm font-semibold text-neutral-700 shadow-sm">
            No hay datos.
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-xs font-bold text-neutral-500">Total registros</p>
                <p className="mt-1 text-2xl font-extrabold text-neutral-900">
                  {stats.total}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-xs font-bold text-neutral-500">Mejor peso</p>
                <p className="mt-1 text-2xl font-extrabold text-neutral-900">
                  {stats.bestWeight != null ? `${stats.bestWeight} kg` : "-"}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-xs font-bold text-neutral-500">Última vez</p>
                <p className="mt-1 text-2xl font-extrabold text-neutral-900">
                  {stats.lastDate}
                </p>
              </div>
            </div>

            {/* Tabla */}
            {data.entries.length === 0 ? (
              <div className="rounded-2xl border bg-white p-5 text-sm text-neutral-700 shadow-sm">
                No hay registros todavía.
              </div>
            ) : (
              <div className="rounded-2xl border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <p className="text-sm font-extrabold text-neutral-900">
                    Historial{" "}
                    <span className="text-neutral-500 font-semibold">
                      ({data.entries.length})
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() => load()}
                    className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    Refrescar
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px]">
                    <thead>
                      <tr className="bg-neutral-50 text-left text-xs font-extrabold text-neutral-700">
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Peso</th>
                        <th className="px-4 py-3">Reps</th>
                        <th className="px-4 py-3">Sets</th>
                        <th className="px-4 py-3 text-right">Acción</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.entries.map((en) => (
                        <tr
                          key={en.id}
                          className="border-t text-sm text-neutral-900 hover:bg-neutral-50"
                        >
                          <td className="px-4 py-3 font-semibold">
                            {new Date(en.date).toLocaleDateString("es-CL")}
                          </td>

                          <td className="px-4 py-3">
                            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-bold text-white">
                              {en.weightKg} kg
                            </span>
                          </td>

                          <td className="px-4 py-3">{en.reps}</td>
                          <td className="px-4 py-3">{en.sets}</td>

                          <td className="px-4 py-3 text-neutral-600">
                            {en.notes?.trim() ? en.notes : "-"}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(en)}
                                className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-neutral-100"
                              >
                                Editar
                              </button>

                                {data && (
                                    <BtnDelete
                                        endpoint={`/api/exercises/${data.id}`}
                                        label="Eliminar ejercicio"
                                        confirmText={`¿Eliminar "${data.name}" y TODOS sus registros?`}
                                        redirectTo="/progres"
                                    />
                                    )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t px-4 py-3 text-xs font-semibold text-neutral-500">
                  Tip: en móvil desliza la tabla hacia los lados.
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Modal Editar */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-neutral-900">Editar registro</h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveEdit} className="mt-4 grid gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700">Fecha</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700">Peso (kg)</label>
                  <input
                    inputMode="decimal"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700">Reps</label>
                  <input
                    inputMode="numeric"
                    value={editReps}
                    onChange={(e) => setEditReps(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700">Sets</label>
                  <input
                    inputMode="numeric"
                    value={editSets}
                    onChange={(e) => setEditSets(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700">Notas (opcional)</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="w-full rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  disabled={saving}
                  className="w-full rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}