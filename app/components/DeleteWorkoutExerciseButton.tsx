"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    workoutExerciseId: string;
};

export default function DeleteWorkoutExerciseButton({
    workoutExerciseId,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        try {
            setLoading(true);

            const response = await fetch(
                `/api/workout-session-exercises/${workoutExerciseId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.error || "No se pudo eliminar el ejercicio");
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo eliminar el ejercicio"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition hover:bg-danger-dim hover:text-danger disabled:opacity-50"
            title="Eliminar ejercicio"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
    );
}