"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";

type Props = {
    setId: string;
};

export default function DeleteWorkoutSetButton({ setId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        try {
            setLoading(true);

            const response = await fetch(`/api/workout-sets/${setId}`, {
                method: "DELETE",
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.error || "No se pudo eliminar la serie");
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo eliminar la serie"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 text-text-dim transition hover:bg-danger-dim hover:text-danger disabled:opacity-50"
        >
            <X size={16} strokeWidth={2.5} />
        </button>
    );
}