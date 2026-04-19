import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const routines = await prisma.routine.findMany({
      where: { userId: user.id },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(routines);
  } catch (error) {
    console.error("GET /api/routines error:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las rutinas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No existe usuario para crear rutinas" },
        { status: 400 }
      );
    }

    const routine = await prisma.routine.create({
      data: {
        name: body?.name?.trim() || "Nueva rutina",
        dayLabel: body?.dayLabel?.trim() || "Sin día",
        userId: user.id,
      },
    });

    return NextResponse.json(routine, { status: 201 });
  } catch (error) {
    console.error("POST /api/routines error:", error);
    return NextResponse.json(
      { error: "No se pudo crear la rutina" },
      { status: 500 }
    );
  }
}