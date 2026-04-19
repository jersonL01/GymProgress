import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        const current = await prisma.workoutSessionExercise.findUnique({
            where: { id },
        });

        if (!current) {
            return NextResponse.json(
                { error: "Ejercicio de sesión no encontrado" },
                { status: 404 }
            );
        }

        await prisma.workoutSessionExercise.delete({
            where: { id },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("DELETE /api/workout-session-exercises/[id] error:", error);
        return NextResponse.json(
            { error: "No se pudo eliminar el ejercicio" },
            { status: 500 }
        );
    }
}