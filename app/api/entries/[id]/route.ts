import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

type Params = { params: { id: string } };

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // Verifica pertenencia
  const entry = await prisma.entry.findFirst({
    where: { id: params.id, userId },
    select: { id: true },
  });

  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  await prisma.entry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({} as any));

  const date = body?.date ? new Date(body.date) : undefined;
  const weightKg = body?.weightKg != null ? Number(body.weightKg) : undefined;
  const reps = body?.reps != null ? Number(body.reps) : undefined;
  const sets = body?.sets != null ? Number(body.sets) : undefined;
  const notes =
    body?.notes != null && String(body.notes).trim() !== "" ? String(body.notes).trim() : null;

  // Validaciones (solo si vienen)
  if (date && Number.isNaN(date.getTime()))
    return NextResponse.json({ error: "date inválida" }, { status: 400 });
  if (weightKg !== undefined && !Number.isFinite(weightKg))
    return NextResponse.json({ error: "weightKg inválido" }, { status: 400 });
  if (reps !== undefined && (!Number.isInteger(reps) || reps <= 0))
    return NextResponse.json({ error: "reps inválido" }, { status: 400 });
  if (sets !== undefined && (!Number.isInteger(sets) || sets <= 0))
    return NextResponse.json({ error: "sets inválido" }, { status: 400 });

  // Verifica pertenencia
  const entry = await prisma.entry.findFirst({
    where: { id: params.id, userId },
    select: { id: true },
  });
  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const updated = await prisma.entry.update({
    where: { id: params.id },
    data: {
      ...(date ? { date } : {}),
      ...(weightKg !== undefined ? { weightKg } : {}),
      ...(reps !== undefined ? { reps } : {}),
      ...(sets !== undefined ? { sets } : {}),
      notes, // si no viene, queda null (simple)
    },
  });

  return NextResponse.json(updated, { status: 200 });
}