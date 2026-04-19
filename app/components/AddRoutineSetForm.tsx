"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    routineExerciseId: string;
    nextSetNumber: number;
};

export default function AddRoutineSetForm({
    routineExerciseId,
    nextSetNumber,
}: Props) {
    const router = useRouter();
    const [targetKg, setTargetKg] = useState("");
    const [targetReps, setTargetReps] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleAddSet(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(
                `/api/routines/exercise/${routineExerciseId}/sets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        setNumber: nextSetNumber,
                        targetKg: targetKg ? Number(targetKg) : null,
                        targetReps: targetReps ? Number(targetReps) : null,
                    }),
                }
            );

            const data = await response.json().catch(() => null);
            console.log("respuesta agregar serie:", response.status, data);

            if (!response.ok) {
                throw new Error(data?.error || "No se pudo agregar la serie");
            }

            setTargetKg("");
            setTargetReps("");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error ? error.message : "Error al agregar la serie"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleAddSet}
            className="space-y-4 rounded-3xl border border-border-strong bg-surface-100 p-5 shadow-sm"
        >
            <div className="text-[13px] font-semibold uppercase tracking-wider text-text-muted">
                Crear Serie {nextSetNumber}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <input
                    type="number"
                    step="0.5"
                    value={targetKg}
                    onChange={(e) => setTargetKg(e.target.value)}
                    placeholder="Peso (kg)"
                    className="rounded-2xl bg-surface-200 px-4 py-3.5 text-white outline-none placeholder:text-text-dim border border-border-strong focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
                <input
                    type="number"
                    value={targetReps}
                    onChange={(e) => setTargetReps(e.target.value)}
                    placeholder="Repeticiones"
                    className="rounded-2xl bg-surface-200 px-4 py-3.5 text-white outline-none placeholder:text-text-dim border border-border-strong focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-surface-300 hover:bg-surface-200 text-white font-semibold px-4 py-3.5 transition-all outline-none border border-border-strong hover:text-brand-light disabled:opacity-50 active:scale-[0.98]"
            >
                {loading ? "Agregando..." : "Agregar Serie"}
            </button>
        </form>
    );
}