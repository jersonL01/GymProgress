import BottomNav from "@/app/components/BottomNav";
import RoutineCard from "@/app/components/RoutineCard";
import NewRoutineButton from "@/app/components/NewRoutineButton";
import { prisma } from "@/app/lib/prisma";

export default async function HomePage() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
  });

  let routines: {
    id: string;
    day: string;
    exercises: string;
  }[] = [];

  if (user) {
    const data = await prisma.routine.findMany({
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

    routines = data.map((routine) => ({
      id: routine.id,
      day: routine.name,
      exercises:
        routine.exercises.map((item) => item.exercise.nameEs || item.exercise.name).join(", ") ||
        "Sin ejercicios",
    }));
  }

  return (
    <main className="min-h-screen bg-bg-base text-white pb-28">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg-app">
        <header className="sticky top-0 z-20 border-b border-border-subtle bg-bg-app/80 px-5 pb-4 pt-8 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-light font-medium mb-1">
                Entrenamiento
              </p>
              <h1 className="text-[32px] font-bold tracking-tight">
                Tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-dark">Rutinas</span>
              </h1>
            </div>

            <div className="rounded-full bg-brand/10 border border-brand/20 px-3 py-1.5 text-xs font-bold text-brand-light tracking-wide">
              PRO
            </div>
          </div>
        </header>

        <section className="flex-1 space-y-6 px-4 py-6">
          <div className="overflow-hidden relative rounded-[32px] border border-border-strong bg-surface-100 p-6 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-[22px] font-semibold tracking-tight text-white">
                Crear nueva rutina
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
                Diseña un plan a tu medida y organiza tus sesiones.
              </p>

              <div className="mt-6">
                <NewRoutineButton />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between px-1">
            <h3 className="text-lg font-semibold tracking-tight">Guardadas</h3>
            <span className="text-sm text-text-dim">{routines.length} {routines.length === 1 ? 'rutina' : 'rutinas'}</span>
          </div>

          <div className="space-y-4">
            {routines.length > 0 ? (
              routines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  id={routine.id}
                  day={routine.day}
                  exercises={routine.exercises}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[32px] border border-border-subtle border-dashed bg-surface-50 p-10 text-center">
                <div className="h-16 w-16 rounded-full bg-surface-200 flex items-center justify-center mb-4">
                  <span className="text-2xl text-text-dim">🎯</span>
                </div>
                <p className="text-base font-medium text-white">Aún no hay rutinas</p>
                <p className="mt-1 text-sm text-text-muted">Empieza creando tu primera rutina arriba.</p>
              </div>
            )}
          </div>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}