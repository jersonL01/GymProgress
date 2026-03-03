import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

function estimate1RM(weightKg: number, reps: number) {
  // Epley: 1RM ≈ w * (1 + reps/30)
  return weightKg * (1 + reps / 30);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const exercisesCount = await prisma.exercise.count({ where: { userId } });
  const entriesCount = await prisma.entry.count({ where: { userId } });

  const exercises = await prisma.exercise.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      category: true,
      entries: {
        select: { date: true, weightKg: true, reps: true, sets: true },
        orderBy: { date: "desc" },
      },
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const perExercise = exercises.map((ex) => {
    const entries = ex.entries ?? [];
    const last = entries[0] ?? null;

    const bestWeight = entries.length ? Math.max(...entries.map((e) => e.weightKg)) : null;

    const best1RM = entries.length
      ? Math.max(...entries.map((e) => estimate1RM(e.weightKg, e.reps)))
      : null;

    return {
      id: ex.id,
      name: ex.name,
      category: ex.category,
      total: entries.length,
      last: last
        ? {
            date: last.date,
            weightKg: last.weightKg,
            reps: last.reps,
            sets: last.sets,
            est1RM: estimate1RM(last.weightKg, last.reps),
          }
        : null,
      bestWeight,
      best1RM,
    };
  });

  const overallBest1RM =
    perExercise.length && perExercise.some((x) => x.best1RM != null)
      ? Math.max(...perExercise.filter((x) => x.best1RM != null).map((x) => x.best1RM as number))
      : null;

  return NextResponse.json(
    {
      exercisesCount,
      entriesCount,
      overallBest1RM,
      perExercise,
    },
    { status: 200 }
  );
}