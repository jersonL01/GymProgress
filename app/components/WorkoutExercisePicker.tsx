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
    sessionId: string;
    exercises: ExerciseItem[];
    replaceWorkoutExerciseId?: string;
};

export default function WorkoutExercisePicker({
    sessionId,
    exercises,
    replaceWorkoutExerciseId,
}: Props) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return exercises;

        return exercises.filter((exercise) => {
            const name = (exercise.nameEs || exercise.name).toLowerCase();
            const muscles = (exercise.primaryMusclesEs || []).join(" ").toLowerCase();
            return name.includes(term) || muscles.includes(term);
        });
    }, [search, exercises]);

    async function handleSelect(exerciseId: string) {
        try {
            setLoadingId(exerciseId);

            const url = replaceWorkoutExerciseId
                ? `/api/workout-session-exercises/${replaceWorkoutExerciseId}/replace`
                : `/api/workout-sessions/${sessionId}/exercise`;

            const method = replaceWorkoutExerciseId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ exerciseId }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.error || "No se pudo seleccionar el ejercicio");
            }

            router.push(`/entreno/${sessionId}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo seleccionar el ejercicio"
            );
        } finally {
            setLoadingId(null);
        }
    }

    return (
    return (
        <section className="space-y-6 px-4 py-5 flex flex-col h-[calc(100vh-80px)]">
            <div className="sticky top-0 z-10 bg-bg-app pb-2">
                <div className="flex items-center gap-3 rounded-2xl bg-surface-100 border border-border-strong px-4 py-3.5 shadow-sm focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-all">
                    <Search size={22} className="text-text-dim" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar ejercicio..."
                        className="w-full bg-transparent text-[17px] text-white placeholder:text-text-dim outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2 pb-20 overflow-y-auto flex-1">
                {filtered.map((exercise) => (
                    <button
                        key={exercise.id}
                        onClick={() => handleSelect(exercise.id)}
                        disabled={loadingId === exercise.id}
                        className="group flex w-full items-center gap-4 rounded-3xl bg-surface-50 p-3 text-left transition-all hover:bg-surface-100 active:scale-[0.98] disabled:opacity-50 border border-transparent hover:border-border-subtle"
                    >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[20px] bg-surface-200">
                            {exercise.images?.[0] ? (
                                <img
                                    src={exercise.images[0]}
                                    alt={exercise.nameEs || exercise.name}
                                    className="h-full w-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100 transition-all"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-muted">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[17px] font-semibold tracking-tight text-white group-hover:text-brand-light transition-colors">
                                {exercise.nameEs || exercise.name}
                            </p>
                            <p className="mt-1 text-[13px] text-text-muted">
                                {exercise.primaryMusclesEs?.join(", ") || "General"}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-200 text-text-dim group-hover:bg-brand group-hover:text-white transition-colors mr-1">
                            {loadingId === exercise.id ? (
                                <span className="animate-pulse">···</span>
                            ) : (
                                <Plus size={20} strokeWidth={2.5} />
                            )}
                        </div>
                    </button>
                ))}

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-[32px] border border-border-subtle border-dashed bg-surface-50 p-10 text-center mt-10">
                        <Search size={32} className="text-text-dim mb-4" />
                        <p className="text-base font-medium text-white">No se encontraron ejercicios</p>
                        <p className="mt-1 text-sm text-text-muted">Intenta con otro término de búsqueda.</p>
                    </div>
                ) : null}
            </div>
        </section>
    );
}