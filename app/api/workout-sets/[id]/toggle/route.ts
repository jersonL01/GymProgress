import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(_: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        const current = await prisma.workoutSessionSet.findUnique({
            where: { id },
        });

        if (!current) {
            return NextResponse.json(
                { error: "Serie no encontrada" },
                { status: 404 }
            );
        }

        const updated = await prisma.workoutSessionSet.update({
            where: { id },
            data: {
                completed: !current.completed,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/workout-sets/[id]/toggle error:", error);
        return NextResponse.json(
            { error: "No se pudo actualizar el check" },
            { status: 500 }
        );
    }
}