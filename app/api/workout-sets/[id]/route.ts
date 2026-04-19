import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        const updated = await prisma.workoutSessionSet.update({
            where: { id },
            data: {
                ...(body?.actualKg !== undefined ? { actualKg: body.actualKg } : {}),
                ...(body?.actualReps !== undefined ? { actualReps: body.actualReps } : {}),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/workout-sets/[id] error:", error);
        return NextResponse.json(
            { error: "No se pudo actualizar la serie" },
            { status: 500 }
        );
    }
}

export async function DELETE(_: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        await prisma.workoutSessionSet.delete({
            where: { id },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("DELETE /api/workout-sets/[id] error:", error);
        return NextResponse.json(
            { error: "No se pudo eliminar la serie" },
            { status: 500 }
        );
    }
}