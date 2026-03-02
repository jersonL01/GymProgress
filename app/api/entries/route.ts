import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  // Auth
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Body
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const catalogId = Number(body?.catalogId);
  const name = String(body?.name ?? "").trim();
  const category =
    body?.category != null && String(body.category).trim() !== ""
      ? String(body.category).trim()
      : null;

  const date = body?.date ? new Date(body.date) : new Date();

  const weightKg = Number(body?.weightKg);
  const reps = Number(body?.reps);
  const sets = Number(body?.sets);
  const notes =
    body?.notes != null && String(body.notes).trim() !== ""
      ? String(body.notes).trim()
      : null;

  // Validaciones
  if (!Number.isFinite(catalogId) || catalogId <= 0) {
    return NextResponse.json({ error: "catalogId inválido" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Falta name" }, { status: 400 });
  }
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "date inválida" }, { status: 400 });
  }

  if (!Number.isFinite(weightKg)) {
    return NextResponse.json({ error: "weightKg inválido" }, { status: 400 });
  }
  if (!Number.isInteger(reps) || reps <= 0) {
    return NextResponse.json({ error: "reps inválido" }, { status: 400 });
  }
  if (!Number.isInteger(sets) || sets <= 0) {
    return NextResponse.json({ error: "sets inválido" }, { status: 400 });
  }

  // Buscar o crear exercise
  const existing = await prisma.exercise.findFirst({
    where: { userId, catalogId },
    select: { id: true },
  });

  const exercise = existing
    ? await prisma.exercise.update({
        where: { id: existing.id },
        data: { name, category },
        select: { id: true },
      })
    : await prisma.exercise.create({
        data: { userId, catalogId, name, category },
        select: { id: true },
      });

  // Crear entry
  const entry = await prisma.entry.create({
    data: {
      userId,
      exerciseId: exercise.id,
      date,
      weightKg,
      reps,
      sets,
      notes,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}