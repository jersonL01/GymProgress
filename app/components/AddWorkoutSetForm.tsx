"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

type Props = {
    workoutSessionExerciseId: string;
    nextSetNumber: number;
};

export default function AddWorkoutSetForm({
    workoutSessionExerciseId,
    nextSetNumber,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        try {
            setLoading(true);

            const response = await fetch(
                `/api/workout-session-exercises/${workoutSessionExerciseId}/sets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        setNumber: nextSetNumber,
                        actualKg: null,
                        actualReps: null,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("No se pudo agregar la serie");
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error al agregar la serie");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border-strong bg-surface-200 px-4 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-surface-300 active:scale-[0.98] disabled:opacity-50"
        >
            <Plus size={20} className="stroke-[2.5]" />
            <span>{loading ? "Agregando..." : "Agregar serie"}</span>
        </button>
    );
}