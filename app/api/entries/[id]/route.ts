import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(_req: Request, context: any) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!id) return NextResponse.json({ error: "Falta id en la URL" }, { status: 400 });

  const entry = await prisma.entry.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  await prisma.entry.delete({ where: { id: entry.id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}