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

    const routine = await prisma.routine.findUnique({
      where: { id },
    });

    if (!routine) {
      return NextResponse.json(
        { error: "Rutina no encontrada" },
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

    const count = await prisma.routineExercise.count({
      where: { routineId: id },
    });

    const routineExercise = await prisma.routineExercise.create({
      data: {
        routineId: id,
        exerciseId,
        notes: "",
        restSeconds: 90,
        sortOrder: count + 1,
      },
    });

    return NextResponse.json(routineExercise, { status: 201 });
  } catch (error) {
    console.error("POST /api/routines/[id]/exercise error:", error);
    return NextResponse.json(
      { error: "No se pudo agregar el ejercicio" },
      { status: 500 }
    );
  }
}