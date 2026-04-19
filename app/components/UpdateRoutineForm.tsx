"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    routineId: string;
    initialName: string;
    initialDayLabel: string;
};

export default function UpdateRoutineForm({
    routineId,
    initialName,
    initialDayLabel,
}: Props) {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [dayLabel, setDayLabel] = useState(initialDayLabel);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(`/api/routines/${routineId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    dayLabel,
                }),
            });

            if (!response.ok) {
                throw new Error("No se pudo actualizar la rutina");
            }

            router.refresh();
            alert("Rutina guardada");
        } catch (error) {
            console.error(error);
            alert("Error al guardar rutina");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-[32px] border border-border-strong bg-surface-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        >
            <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-muted">
                    Nombre de rutina
                </label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl bg-surface-200 px-4 py-3.5 text-[17px] font-semibold text-white outline-none border border-border-strong placeholder:text-text-dim focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                    placeholder="Ej: Push A"
                />
            </div>

            <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-muted">
                    Día
                </label>
                <input
                    value={dayLabel}
                    onChange={(e) => setDayLabel(e.target.value)}
                    className="w-full rounded-2xl bg-surface-200 px-4 py-3.5 text-[17px] text-white outline-none border border-border-strong placeholder:text-text-dim focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                    placeholder="Ej: Lunes"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-brand px-4 py-4 text-[17px] font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-brand-hover active:scale-[0.98] transition-all disabled:opacity-50"
            >
                {loading ? "Guardando..." : "Guardar rutina"}
            </button>
        </form>
    );
}