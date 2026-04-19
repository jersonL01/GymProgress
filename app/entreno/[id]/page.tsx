import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import WorkoutTimer from "@/app/components/WorkoutTimer";
import UpdateWorkoutSetField from "@/app/components/UpdateWorkoutSetField";
import ToggleWorkoutSetButton from "@/app/components/ToggleWorkoutSetButton";
import AddWorkoutSetForm from "@/app/components/AddWorkoutSetForm";
import FinishWorkoutActions from "@/app/components/FinishWorkoutActions";
import AddWorkoutExerciseButton from "@/app/components/AddWorkoutExerciseButton";
import ReplaceWorkoutExerciseButton from "@/app/components/ReplaceWorkoutExerciseButton";
import DeleteWorkoutExerciseButton from "@/app/components/DeleteWorkoutExerciseButton";
import DeleteWorkoutSetButton from "@/app/components/DeleteWorkoutSetButton";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function EntrenoPage({ params }: PageProps) {
    const { id } = await params;

    const session = await prisma.workoutSession.findUnique({
        where: { id },
        include: {
            exercises: {
                include: {
                    exercise: true,
                    sets: {
                        orderBy: { setNumber: "asc" },
                    },
                },
                orderBy: { sortOrder: "asc" },
            },
        },
    });

    if (!session) {
        return (
            <main className="min-h-screen bg-black p-6 text-white">
                Sesión no encontrada.
            </main>
        );
    }

    const totalSets = session.exercises.reduce(
        (acc, ex) => acc + ex.sets.length,
        0
    );

    const totalVolume = session.exercises.reduce((acc, ex) => {
        const exVolume = ex.sets.reduce((setAcc, set) => {
            return setAcc + (set.actualKg ?? 0) * (set.actualReps ?? 0);
        }, 0);

        return acc + exVolume;
    }, 0);

    const completedSets = session.exercises.reduce((acc, ex) => {
        return acc + ex.sets.filter((set) => set.completed).length;
    }, 0);

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <div className="mx-auto min-h-screen w-full max-w-md bg-black">
                <header className="sticky top-0 z-30 border-b border-white/10 bg-[#121319]/95 px-4 pb-4 pt-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-3">
                        <Link
                            href="/home"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white"
                        >
                            ˅
                        </Link>

                        <div className="flex-1">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                                Entreno en curso
                            </p>
                            <h1 className="truncate text-[22px] font-semibold text-white">
                                Sesión
                            </h1>
                        </div>

                        <FinishWorkoutActions sessionId={session.id} />
                    </div>
                </header>

                <section className="border-b border-white/10 px-4 py-5">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-[22px] bg-[#15161B] p-4">
                            <p className="text-sm text-white/40">Duración</p>
                            <WorkoutTimer startedAt={session.startedAt.toISOString()} />
                        </div>

                        <div className="rounded-[22px] bg-[#15161B] p-4">
                            <p className="text-sm text-white/40">Volumen</p>
                            <p className="mt-2 text-2xl text-white">{totalVolume} kg</p>
                        </div>

                        <div className="rounded-[22px] bg-[#15161B] p-4">
                            <p className="text-sm text-white/40">Sets</p>
                            <p className="mt-2 text-2xl text-white">
                                {completedSets}/{totalSets}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 px-4 py-5 pb-10">
                    <AddWorkoutExerciseButton sessionId={session.id} />

                    {session.exercises.map((exercise) => (
                        <article
                            key={exercise.id}
                            className="space-y-4 rounded-[30px] border border-white/5 bg-[#111216] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
                                    {exercise.exercise.images?.[0] ? (
                                        <img
                                            src={exercise.exercise.images[0]}
                                            alt={exercise.nameSnapshot}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-white/30">
                                            Sin foto
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="truncate text-[21px] font-semibold text-[#1693FF]">
                                            {exercise.nameSnapshot}
                                        </h2>

                                        <div className="flex items-center gap-3">
                                            <ReplaceWorkoutExerciseButton
                                                sessionId={session.id}
                                                workoutExerciseId={exercise.id}
                                            />
                                            <DeleteWorkoutExerciseButton
                                                workoutExerciseId={exercise.id}
                                            />
                                        </div>
                                    </div>

                                    <p className="mt-2 text-[15px] leading-6 text-white/45">
                                        {exercise.notes || "Agregar notas aquí..."}
                                    </p>

                                    <p className="mt-3 text-[18px] font-medium text-[#1693FF]">
                                        Descanso: {exercise.restSeconds ?? 90}s
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-[22px] border border-white/5">
                                <div className="grid grid-cols-[42px_1fr_74px_74px_50px_28px] items-center gap-2 bg-black px-3 py-3 text-[11px] uppercase tracking-[0.16em] text-white/45">
                                    <span>Serie</span>
                                    <span>Anterior</span>
                                    <span>Kg</span>
                                    <span>Reps</span>
                                    <span>✓</span>
                                    <span></span>
                                </div>

                                {exercise.sets.map((set, index) => (
                                    <div
                                        key={set.id}
                                        className={`grid grid-cols-[42px_1fr_74px_74px_50px_28px] items-center gap-2 px-3 py-4 ${index % 2 === 1 ? "bg-[#17181F]" : "bg-black"
                                            }`}
                                    >
                                        <span className="text-[20px] font-semibold text-white">
                                            {set.setNumber}
                                        </span>

                                        <span className="text-[15px] text-white/40">
                                            {(set.previousKg ?? "-") + "kg x " + (set.previousReps ?? "-")}
                                        </span>

                                        <UpdateWorkoutSetField
                                            setId={set.id}
                                            initialValue={set.actualKg}
                                            field="actualKg"
                                        />

                                        <UpdateWorkoutSetField
                                            setId={set.id}
                                            initialValue={set.actualReps}
                                            field="actualReps"
                                        />

                                        <ToggleWorkoutSetButton
                                            setId={set.id}
                                            completed={set.completed}
                                        />

                                        <DeleteWorkoutSetButton setId={set.id} />
                                    </div>
                                ))}
                            </div>

                            <AddWorkoutSetForm
                                workoutSessionExerciseId={exercise.id}
                                nextSetNumber={exercise.sets.length + 1}
                            />
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}