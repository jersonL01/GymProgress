import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import WorkoutExercisePicker from "@/app/components/WorkoutExercisePicker";

type PageProps = {
    searchParams: Promise<{
        sessionId?: string;
        replaceWorkoutExerciseId?: string;
    }>;
};

export default async function AddWorkoutExercisePage({
    searchParams,
}: PageProps) {
    const { sessionId, replaceWorkoutExerciseId } = await searchParams;

    if (!sessionId) {
        return (
            <main className="min-h-screen bg-black p-6 text-white">
                No se recibió sessionId.
            </main>
        );
    }

    const session = await prisma.workoutSession.findUnique({
        where: { id: sessionId },
    });

    if (!session) {
        return (
            <main className="min-h-screen bg-black p-6 text-white">
                Sesión no encontrada.
            </main>
        );
    }

    const exercises = await prisma.exercise.findMany({
        orderBy: {
            nameEs: "asc",
        },
        take: 300,
        select: {
            id: true,
            name: true,
            nameEs: true,
            primaryMusclesEs: true,
            images: true,
        },
    });

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto min-h-screen w-full max-w-md bg-black pb-10">
                <header className="sticky top-0 z-20 border-b border-white/10 bg-[#121319]/95 px-4 pb-4 pt-6 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/entreno/${sessionId}`}
                            className="text-[17px] text-[#1693FF]"
                        >
                            Cancelar
                        </Link>

                        <h1 className="text-[18px] font-medium text-white">
                            {replaceWorkoutExerciseId ? "Cambiar ejercicio" : "Agregar ejercicio"}
                        </h1>

                        <div className="text-[17px] text-white/30">Lista</div>
                    </div>
                </header>

                <WorkoutExercisePicker
                    sessionId={sessionId}
                    replaceWorkoutExerciseId={replaceWorkoutExerciseId}
                    exercises={exercises}
                />
            </div>
        </main>
    );
}