import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

type Params = { params: { id: string } };

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const ex = await prisma.exercise.findFirst({
    where: { id: params.id, userId },
    select: { id: true },
  });
  if (!ex) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // borra primero sus entries (por si no tienes cascade)
  await prisma.entry.deleteMany({ where: { exerciseId: params.id, userId } });
  await prisma.exercise.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true }, { status: 200 });
}