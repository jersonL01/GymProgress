import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        let updateRoutine = false;

        try {
            const body = await req.json();
            updateRoutine = Boolean(body?.updateRoutine);
        } catch {
            updateRoutine = false;
        }

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
            return NextResponse.json(
                { error: "Sesión no encontrada" },
                { status: 404 }
            );
        }

        if (session.status === "completed") {
            return NextResponse.json({
                ok: true,
                message: "La sesión ya estaba finalizada",
            });
        }

        const now = new Date();
        const durationSec = Math.max(
            0,
            Math.floor((now.getTime() - session.startedAt.getTime()) / 1000)
        );

        await prisma.$transaction(async (tx) => {
            await tx.workoutSession.update({
                where: { id },
                data: {
                    endedAt: now,
                    durationSec,
                    status: "completed",
                },
            });

            if (updateRoutine) {
                await tx.routineSet.deleteMany({
                    where: {
                        routineExercise: {
                            routineId: session.routineId,
                        },
                    },
                });

                await tx.routineExercise.deleteMany({
                    where: {
                        routineId: session.routineId,
                    },
                });

                for (const exercise of session.exercises) {
                    const createdRoutineExercise = await tx.routineExercise.create({
                        data: {
                            routineId: session.routineId,
                            exerciseId: exercise.exerciseId,
                            notes: exercise.notes,
                            restSeconds: exercise.restSeconds,
                            sortOrder: exercise.sortOrder,
                        },
                    });

                    for (const set of exercise.sets) {
                        await tx.routineSet.create({
                            data: {
                                routineExerciseId: createdRoutineExercise.id,
                                setNumber: set.setNumber,
                                targetKg: set.actualKg,
                                targetReps: set.actualReps,
                                completed: false,
                            },
                        });
                    }
                }
            }
        });

        return NextResponse.json({
            ok: true,
            updatedRoutine: updateRoutine,
            durationSec,
        });
    } catch (error) {
        console.error("PATCH /api/workout-sessions/[id]/finish error:", error);
        return NextResponse.json(
            { error: "No se pudo finalizar la sesión" },
            { status: 500 }
        );
    }
}