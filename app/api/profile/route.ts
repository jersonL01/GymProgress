import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      include: {
        profile: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user.profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { error: "No se pudo obtener el perfil" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const user = await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        weightKg: body.weightKg,
        heightCm: body.heightCm,
        age: body.age,
        goal: body.goal,
        caloriesTarget: body.caloriesTarget,
        proteinTarget: body.proteinTarget,
        notes: body.notes,
      },
      create: {
        userId: user.id,
        weightKg: body.weightKg,
        heightCm: body.heightCm,
        age: body.age,
        goal: body.goal,
        caloriesTarget: body.caloriesTarget,
        proteinTarget: body.proteinTarget,
        notes: body.notes,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("PATCH /api/profile error:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el perfil" },
      { status: 500 }
    );
  }
}