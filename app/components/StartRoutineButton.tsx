"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    routineId: string;
};

export default function StartRoutineButton({ routineId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleStart() {
        try {
            setLoading(true);

            const response = await fetch(`/api/routines/${routineId}/start`, {
                method: "POST",
            });

            const data = await response.json();

            if (!response.ok || !data?.id) {
                throw new Error(data?.error || "No se pudo comenzar la rutina");
            }

            router.push(`/entreno/${data.id}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("No se pudo comenzar la rutina");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleStart}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-brand hover:bg-brand-hover px-5 py-4 text-center text-[17px] font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all active:scale-[0.98] disabled:opacity-60"
        >
            {loading ? "Comenzando..." : "Comenzar rutina"}
        </button>
    );
}