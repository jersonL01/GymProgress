import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

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

        return NextResponse.json(routine);
    } catch (error) {
        console.error("GET /api/routines/[id] error:", error);
        return NextResponse.json(
            { error: "No se pudo obtener la rutina" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        const routine = await prisma.routine.update({
            where: { id },
            data: {
                ...(body?.name !== undefined ? { name: body.name } : {}),
                ...(body?.dayLabel !== undefined ? { dayLabel: body.dayLabel } : {}),
            },
        });

        return NextResponse.json(routine);
    } catch (error) {
        console.error("PATCH /api/routines/[id] error:", error);
        return NextResponse.json(
            { error: "No se pudo actualizar la rutina" },
            { status: 500 }
        );
    }
}

export async function DELETE(_: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        const routine = await prisma.routine.findUnique({
            where: { id },
        });

        if (!routine) {
            return NextResponse.json(
                { error: "Rutina no encontrada" },
                { status: 404 }
            );
        }

        await prisma.routine.delete({
            where: { id },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("DELETE /api/routines/[id] error:", error);
        return NextResponse.json(
            { error: "No se pudo borrar la rutina" },
            { status: 500 }
        );
    }
}