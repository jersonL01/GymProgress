import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        console.log("SET POST id:", id, "body:", body);

        const routineExercise = await prisma.routineExercise.findUnique({
            where: { id },
        });

        if (!routineExercise) {
            return NextResponse.json(
                { error: "RoutineExercise no encontrado" },
                { status: 404 }
            );
        }

        const setNumber =
            typeof body?.setNumber === "number" ? body.setNumber : 1;

        const set = await prisma.routineSet.create({
            data: {
                routineExerciseId: id,
                setNumber,
                targetKg:
                    typeof body?.targetKg === "number" ? body.targetKg : null,
                targetReps:
                    typeof body?.targetReps === "number" ? body.targetReps : null,
            },
        });

        return NextResponse.json(set, { status: 201 });
    } catch (error) {
        console.error("POST /api/routines/exercise/[id]/sets error:", error);
        return NextResponse.json(
            { error: "No se pudo agregar la serie" },
            { status: 500 }
        );
    }
}