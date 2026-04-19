"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

type Props = {
    routineExerciseId: string;
    nextSetNumber: number;
};

export default function AddRoutineTemplateSetButton({
    routineExerciseId,
    nextSetNumber,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleAddSet() {
        try {
            setLoading(true);

            const response = await fetch(
                `/api/routine-exercises/${routineExerciseId}/sets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        setNumber: nextSetNumber,
                        targetKg: null,
                        targetReps: null,
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.error || "No se pudo agregar la serie");
            }

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
        <button
            type="button"
            onClick={handleAddSet}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-[22px] bg-[#17181F] px-4 py-5 text-[18px] font-medium text-white transition active:scale-[0.99] disabled:opacity-60"
        >
            <Plus size={26} />
            <span>{loading ? "Agregando..." : "Agregar serie"}</span>
        </button>
    );
}