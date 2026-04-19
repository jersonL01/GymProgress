import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
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

        const current = await prisma.workoutSessionExercise.findUnique({
            where: { id },
        });

        if (!current) {
            return NextResponse.json(
                { error: "Ejercicio de sesión no encontrado" },
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

        const updated = await prisma.workoutSessionExercise.update({
            where: { id },
            data: {
                exerciseId,
                nameSnapshot: exercise.nameEs || exercise.name,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/workout-session-exercises/[id]/replace error:", error);
        return NextResponse.json(
            { error: "No se pudo reemplazar el ejercicio" },
            { status: 500 }
        );
    }
}