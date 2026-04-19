"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";

type Props = {
    setId: string;
    completed: boolean;
};

export default function ToggleWorkoutSetButton({ setId, completed }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleToggle() {
        try {
            setLoading(true);
            await fetch(`/api/workout-sets/${setId}/toggle`, {
                method: "PATCH",
            });
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("No se pudo actualizar la serie");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all disabled:opacity-60 ${completed
                    ? "bg-accent shadow-[0_0_15px_rgba(16,185,129,0.4)] text-white scale-105"
                    : "bg-surface-200 text-text-dim hover:bg-surface-300"
                }`}
        >
            <Check size={24} strokeWidth={completed ? 3.5 : 2} className={completed ? "scale-100" : "scale-90"} />
        </button>
    );
}