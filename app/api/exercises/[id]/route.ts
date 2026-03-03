import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(_req: Request, context: any) {
  const { id } = await context.params; // ✅ en tu Next params es Promise

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!id) return NextResponse.json({ error: "Falta id en la URL" }, { status: 400 });

  // Verificar que el ejercicio sea del usuario
  const ex = await prisma.exercise.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!ex) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // ✅ Borrar entries del ejercicio y luego el ejercicio
  await prisma.$transaction([
    prisma.entry.deleteMany({ where: { userId, exerciseId: ex.id } }),
    prisma.exercise.delete({ where: { id: ex.id } }),
  ]);

  return NextResponse.json({ ok: true }, { status: 200 });
}