"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import DeleteAlert from "@/app/components/DeleteAlert";

type EntryRow = {
  id: string;
  date: string;
  weightKg: number;
  reps: number;
  sets: number;
  notes: string | null;
};

type ExercisePayload = {
  id: string;
  name: string;
  category: string | null;
  catalogId: number;
  entries: EntryRow[];
};

export default function VerRegistrosPage() {
  const params = useParams<{ id: string }>();
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

  // ✅ Eliminar REGISTRO (Entry)
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ Eliminar EJERCICIO completo
  const [exDeleteOpen, setExDeleteOpen] = useState(false);
  const [exDeleting, setExDeleting] = useState(false);

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

  function openEdit(row: EntryRow) {
    setEditing(row);
    setEditDate(new Date(row.date).toISOString().slice(0, 10));
    setEditWeight(String(row.weightKg));
    setEditReps(String(row.reps));
    setEditSets(String(row.sets));
    setEditNotes(row.notes ?? "");
  }

  async function saveEdit(e: FormEvent) {
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

  // --- Delete entry (registro) ---
  function askDelete(entryId: string) {
    setDeleteTargetId(entryId);
    setDeleteOpen(true);
  }

  async function confirmDeleteEntry() {
    if (!deleteTargetId) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/entries/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json?.error ?? "No se pudo eliminar");
        return;
      }

      setDeleteOpen(false);
      setDeleteTargetId(null);
      await load();
    } finally {
      setDeleting(false);
    }
  }

  // --- Delete exercise (ejercicio + todos los registros) ---
  async function confirmDeleteExercise() {
    if (!data?.id) return;

    setExDeleting(true);
    try {
      const res = await fetch(`/api/exercises/${data.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json?.error ?? "No se pudo eliminar el ejercicio");
        return;
      }

      // volver a progreso
      window.location.href = "/progres";
    } finally {
      setExDeleting(false);
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
        <div className="mx-auto max-w-5xl px-4 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Registros
              </h1>

              {data ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/90">
                    {data.name}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white/70">
                    {data.category ?? "Sin categoría"}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white/70">
                    catalogId: {data.catalogId}
                  </span>
                </div>
              ) : (
                <p className="mt-1 text-sm text-white/70">Cargando…</p>
              )}
            </div>

            {/* ✅ Botones adaptados a móvil */}
            <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-2">
              <Link
                href="/progres"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20 sm:w-auto"
              >
                ← Progreso
              </Link>

              <Link
                href={registerHref}
                className="w-full rounded-xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_14px_40px_rgba(37,99,235,0.35)] transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/25 sm:w-auto"
              >
                + Registrar
              </Link>

              <button
                type="button"
                onClick={() => setExDeleteOpen(true)}
                disabled={!data}
                className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm font-semibold text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-red-500/20 sm:w-auto"
              >
                Eliminar ejercicio
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-sm font-semibold text-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            Cargando…
          </div>
        ) : err ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm font-semibold text-red-200 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            {err}
          </div>
        ) : !data ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-sm font-semibold text-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            No hay datos.
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <p className="text-xs font-bold text-white/50">Total registros</p>
                <p className="mt-1 text-2xl font-extrabold text-white">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <p className="text-xs font-bold text-white/50">Mejor peso</p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {stats.bestWeight != null ? `${stats.bestWeight} kg` : "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <p className="text-xs font-bold text-white/50">Última vez</p>
                <p className="mt-1 text-2xl font-extrabold text-white">{stats.lastDate}</p>
              </div>
            </div>

            {data.entries.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-sm text-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                No hay registros todavía.
              </div>
            ) : (
              <>
                {/* MOBILE: Cards */}
                <div className="grid gap-3 sm:hidden">
                  {data.entries.map((en) => (
                    <div
                      key={en.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-extrabold text-white">
                            {new Date(en.date).toLocaleDateString("es-CL")}
                          </p>
                          <p className="mt-1 text-xs text-white/60">
                            {en.notes?.trim() ? en.notes : "Sin notas"}
                          </p>
                        </div>

                        <span className="inline-flex items-center rounded-full border border-white/10 bg-blue-500/15 px-2 py-0.5 text-xs font-bold text-blue-200">
                          {en.weightKg} kg
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                          <p className="text-[11px] font-semibold text-white/50">Reps</p>
                          <p className="text-lg font-extrabold text-white">{en.reps}</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                          <p className="text-[11px] font-semibold text-white/50">Sets</p>
                          <p className="text-lg font-extrabold text-white">{en.sets}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(en)}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => askDelete(en.id)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/15 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP: Tabla */}
                <div className="hidden sm:block rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-extrabold text-white">
                      Historial{" "}
                      <span className="text-white/60 font-semibold">
                        ({data.entries.length})
                      </span>
                    </p>

                    <button
                      type="button"
                      onClick={() => load()}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                      Refrescar
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px]">
                      <thead>
                        <tr className="bg-black/20 text-left text-xs font-extrabold text-white/70">
                          <th className="px-4 py-3">Fecha</th>
                          <th className="px-4 py-3">Peso</th>
                          <th className="px-4 py-3">Reps</th>
                          <th className="px-4 py-3">Sets</th>
                          <th className="px-4 py-3">Notas</th>
                          <th className="px-4 py-3 text-right">Acción</th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.entries.map((en) => (
                          <tr
                            key={en.id}
                            className="border-t border-white/10 text-sm text-white/90 hover:bg-white/[0.05]"
                          >
                            <td className="px-4 py-3 font-semibold">
                              {new Date(en.date).toLocaleDateString("es-CL")}
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-full border border-white/10 bg-blue-500/15 px-2 py-0.5 text-xs font-bold text-blue-200">
                                {en.weightKg} kg
                              </span>
                            </td>
                            <td className="px-4 py-3">{en.reps}</td>
                            <td className="px-4 py-3">{en.sets}</td>
                            <td className="px-4 py-3 text-white/70">
                              {en.notes?.trim() ? en.notes : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEdit(en)}
                                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => askDelete(en.id)}
                                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/15 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-white/10 px-4 py-3 text-xs font-semibold text-white/45">
                    Tip: en móvil verás tarjetas; en desktop tabla.
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* ✅ Modal eliminar ENTRY */}
      <DeleteAlert
        open={deleteOpen}
        onClose={() => {
          if (deleting) return;
          setDeleteOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={confirmDeleteEntry}
        loading={deleting}
        title="Eliminar registro"
        description="Se eliminará este registro del historial. Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
      />

      {/* ✅ Modal eliminar EJERCICIO */}
      <DeleteAlert
        open={exDeleteOpen}
        onClose={() => {
          if (exDeleting) return;
          setExDeleteOpen(false);
        }}
        onConfirm={confirmDeleteExercise}
        loading={exDeleting}
        title="Eliminar ejercicio"
        description={
          data
            ? `Se eliminará "${data.name}" y TODOS sus registros. Esta acción no se puede deshacer.`
            : "Se eliminará el ejercicio y todos sus registros."
        }
        confirmText="Sí, eliminar todo"
      />

      {/* Modal Editar */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.08] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Editar registro</h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveEdit} className="mt-4 grid gap-3">
              <div>
                <label className="text-xs font-semibold text-white/70">Fecha</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-white/70">Peso (kg)</label>
                  <input
                    inputMode="decimal"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">Reps</label>
                  <input
                    inputMode="numeric"
                    value={editReps}
                    onChange={(e) => setEditReps(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">Sets</label>
                  <input
                    inputMode="numeric"
                    value={editSets}
                    onChange={(e) => setEditSets(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70">Notas (opcional)</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15"
                />
              </div>

              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                >
                  Cancelar
                </button>

                <button
                  disabled={saving}
                  className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(37,99,235,0.35)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
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