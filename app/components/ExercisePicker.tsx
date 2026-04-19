"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type ExerciseItem = {
    id: string;
    name: string;
    nameEs: string | null;
    primaryMusclesEs: string[];
    images: string[];
};

type Props = {
    routineId: string;
    exercises: ExerciseItem[];
};

export default function ExercisePicker({ routineId, exercises }: Props) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return exercises;

        return exercises.filter((exercise) => {
            const name = (exercise.nameEs || exercise.name || "").toLowerCase();
            const muscles = (exercise.primaryMusclesEs || []).join(" ").toLowerCase();
            return name.includes(term) || muscles.includes(term);
        });
    }, [search, exercises]);

    async function handleSelect(exerciseId: string) {
        try {
            setLoadingId(exerciseId);

            const response = await fetch(`/api/routines/${routineId}/exercise`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    exerciseId,
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.error || "No se pudo agregar el ejercicio");
            }

            router.push(`/rutinas/${routineId}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("No se pudo agregar el ejercicio");
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <section className="space-y-5 px-4 py-5">
            <div className="flex items-center gap-3 rounded-[18px] bg-[#17181F] px-4 py-4">
                <Search size={22} className="text-white/45" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar ejercicio"
                    className="w-full bg-transparent text-[18px] text-white placeholder:text-white/35 outline-none"
                />
            </div>

            <div className="space-y-1">
                {filtered.map((exercise) => (
                    <button
                        key={exercise.id}
                        onClick={() => handleSelect(exercise.id)}
                        disabled={loadingId === exercise.id}
                        className="flex w-full items-center gap-4 border-b border-white/10 py-4 text-left disabled:opacity-60"
                    >
                        <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full bg-white/10">
                            {exercise.images?.[0] ? (
                                <img
                                    src={exercise.images[0]}
                                    alt={exercise.nameEs || exercise.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[18px] text-white">
                                {exercise.nameEs || exercise.name}
                            </p>
                            <p className="mt-1 text-[15px] text-white/45">
                                {exercise.primaryMusclesEs?.join(", ") || "Sin músculo"}
                            </p>
                        </div>

                        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border-2 border-white text-[20px] text-white">
                            {loadingId === exercise.id ? "..." : "+"}
                        </div>
                    </button>
                ))}

                {filtered.length === 0 ? (
                    <div className="rounded-[20px] bg-[#17181F] p-4 text-white/60">
                        No se encontraron ejercicios.
                    </div>
                ) : null}
            </div>
        </section>
    );
}