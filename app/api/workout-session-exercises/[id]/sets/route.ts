import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        const exercise = await prisma.workoutSessionExercise.findUnique({
            where: { id },
        });

        if (!exercise) {
            return NextResponse.json(
                { error: "Ejercicio de sesión no encontrado" },
                { status: 404 }
            );
        }

        const created = await prisma.workoutSessionSet.create({
            data: {
                workoutSessionExerciseId: id,
                setNumber: body?.setNumber ?? 1,
                actualKg: body?.actualKg ?? null,
                actualReps: body?.actualReps ?? null,
                completed: false,
            },
        });

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("POST /api/workout-session-exercises/[id]/sets error:", error);
        return NextResponse.json(
            { error: "No se pudo agregar la serie" },
            { status: 500 }
        );
    }
}