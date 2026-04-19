import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await req.json();
        const exerciseId = body?.exerciseId as string | undefined;

        if (!exerciseId) {
            return NextResponse.json(
                { error: "exerciseId es obligatorio" },
                { status: 400 }
            );
        }

        const session = await prisma.workoutSession.findUnique({
            where: { id },
        });

        if (!session) {
            return NextResponse.json(
                { error: "Sesión no encontrada" },
                { status: 404 }
            );
        }

        const exercise = await prisma.exercise.findUnique({
            where: { id: exerciseId },
        });

        if (!exercise) {
            return NextResponse.json(
                { error: "Ejercicio no encontrado" },
                { status: 404 }
            );
        }

        const count = await prisma.workoutSessionExercise.count({
            where: { workoutSessionId: id },
        });

        const created = await prisma.workoutSessionExercise.create({
            data: {
                workoutSessionId: id,
                exerciseId,
                nameSnapshot: exercise.nameEs || exercise.name,
                notes: "",
                restSeconds: 90,
                sortOrder: count + 1,
            },
        });

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("POST /api/workout-sessions/[id]/exercise error:", error);
        return NextResponse.json(
            { error: "No se pudo agregar el ejercicio al entreno" },
            { status: 500 }
        );
    }
}