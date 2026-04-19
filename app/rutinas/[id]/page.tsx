import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import UpdateRoutineForm from "@/app/components/UpdateRoutineForm";
import AddRoutineSetForm from "@/app/components/AddRoutineSetForm";
import AddRoutineTemplateSetButton from "@/app/components/AddRoutineTemplateSetButton";
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoutineDetailPage({ params }: PageProps) {
  const { id } = await params;

  const routine = await prisma.routine.findUnique({
    where: { id },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: {
            orderBy: { setNumber: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!routine) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        Rutina no encontrada.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto min-h-screen w-full max-w-md bg-black pb-10">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#121319]/95 px-4 pb-4 pt-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <Link href="/home" className="text-[17px] text-[#1693FF]">
              Volver
            </Link>

            <h1 className="text-[18px] font-medium text-white">
              Editar rutina
            </h1>

            <div className="text-[17px] text-white/30">Editar</div>
          </div>
        </header>

        <section className="space-y-6 px-4 py-5">
          <UpdateRoutineForm
            routineId={routine.id}
            initialName={routine.name}
            initialDayLabel={routine.dayLabel || ""}
          />

          {routine.exercises.map((routineExercise) => (
            <article
              key={routineExercise.id}
              className="space-y-4 rounded-[24px] border border-white/5 bg-[#15161B] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
                  {routineExercise.exercise.images?.[0] ? (
                    <img
                      src={routineExercise.exercise.images[0]}
                      alt={
                        routineExercise.exercise.nameEs ||
                        routineExercise.exercise.name
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-white/30">
                      Sin foto
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-[22px] font-semibold text-[#1693FF]">
                    {routineExercise.exercise.nameEs ||
                      routineExercise.exercise.name}
                  </h2>
                  <p className="mt-1 text-[15px] text-white/45">
                    Descanso: {routineExercise.restSeconds ?? 90}s
                  </p>
                  <p className="mt-2 text-[14px] text-white/35">
                    {routineExercise.notes || "Sin notas"}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[20px] border border-white/5">
                <div className="grid grid-cols-3 bg-black px-5 py-3 text-[13px] uppercase tracking-wide text-white/55">
                  <span>Serie</span>
                  <span>Kg</span>
                  <span>Reps</span>
                </div>

                {routineExercise.sets.length > 0 ? (
                  routineExercise.sets.map((item, index) => (
                    <div
                      key={item.id}
                      className={`grid grid-cols-3 px-5 py-5 text-[20px] ${index % 2 === 1 ? "bg-[#17181F]" : "bg-black"
                        }`}
                    >
                      <span>{item.setNumber}</span>
                      <span>{item.targetKg ?? "-"}</span>
                      <span>{item.targetReps ?? "-"}</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-black px-5 py-5 text-white/45">
                    Este ejercicio aún no tiene series.
                  </div>
                )}
              </div>

              <AddRoutineTemplateSetButton
                routineExerciseId={routineExercise.id}
                nextSetNumber={routineExercise.sets.length + 1}
              />
            </article>
          ))}

          <Link
            href={`/rutinas/agregar-ejercicio?routineId=${routine.id}`}
            className="flex w-full items-center justify-center gap-3 rounded-[20px] bg-[#1693FF] px-4 py-5 text-[18px] font-medium text-white"
          >
            Agregar ejercicio
          </Link>
        </section>
      </div>
    </main>
  );
}