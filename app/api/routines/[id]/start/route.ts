import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(_: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        const user = await prisma.user.findFirst({
            orderBy: { createdAt: "asc" },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        const routine = await prisma.routine.findUnique({
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

        if (!routine) {
            return NextResponse.json(
                { error: "Rutina no encontrada" },
                { status: 404 }
            );
        }

        const session = await prisma.workoutSession.create({
            data: {
                routineId: routine.id,
                userId: user.id,
                status: "in_progress",
                exercises: {
                    create: routine.exercises.map((routineExercise) => ({
                        exerciseId: routineExercise.exerciseId,
                        nameSnapshot:
                            routineExercise.exercise.nameEs || routineExercise.exercise.name,
                        notes: routineExercise.notes,
                        restSeconds: routineExercise.restSeconds,
                        sortOrder: routineExercise.sortOrder,
                        sets: {
                            create: routineExercise.sets.map((set) => ({
                                setNumber: set.setNumber,
                                previousKg: set.targetKg,
                                previousReps: set.targetReps,
                                actualKg: set.targetKg,
                                actualReps: set.targetReps,
                                completed: false,
                            })),
                        },
                    })),
                },
            },
        });

        return NextResponse.json(session, { status: 201 });
    } catch (error) {
        console.error("POST /api/routines/[id]/start error:", error);
        return NextResponse.json(
            { error: "No se pudo iniciar la rutina" },
            { status: 500 }
        );
    }
}