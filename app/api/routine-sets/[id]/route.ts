import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        const updated = await prisma.routineSet.update({
            where: { id },
            data: {
                ...(body?.targetKg !== undefined ? { targetKg: body.targetKg } : {}),
                ...(body?.targetReps !== undefined ? { targetReps: body.targetReps } : {}),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/routine-sets/[id] error:", error);
        return NextResponse.json(
            { error: "No se pudo actualizar la serie" },
            { status: 500 }
        );
    }
}