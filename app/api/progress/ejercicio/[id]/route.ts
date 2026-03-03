import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function GET(_req: Request, context: any) {
  const { id } = await context.params; // ✅ params es Promise

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const exercise = await prisma.exercise.findFirst({
    where: { id, userId },
    select: {
      id: true,
      name: true,
      category: true,
      catalogId: true,
      entries: {
        select: { id: true, date: true, weightKg: true, reps: true, sets: true, notes: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!exercise) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json(exercise, { status: 200 });
}
