import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import ExercisePicker from "@/app/components/ExercisePicker";

type PageProps = {
    searchParams: Promise<{ routineId?: string }>;
};

export default async function AddExercisePage({ searchParams }: PageProps) {
    const { routineId } = await searchParams;

    if (!routineId) {
        return (
            <main className="min-h-screen bg-black p-6 text-white">
                No se recibió routineId.
            </main>
        );
    }

    const routine = await prisma.routine.findUnique({
        where: { id: routineId },
    });

    if (!routine) {
        return (
            <main className="min-h-screen bg-black p-6 text-white">
                Rutina no encontrada.
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
                            href={`/rutinas/${routineId}`}
                            className="text-[17px] text-[#1693FF]"
                        >
                            Cancelar
                        </Link>

                        <h1 className="text-[18px] font-medium text-white">
                            Agregar ejercicio
                        </h1>

                        <div className="text-[17px] text-white/30">Lista</div>
                    </div>
                </header>

                <ExercisePicker routineId={routineId} exercises={exercises} />
            </div>
        </main>
    );
}