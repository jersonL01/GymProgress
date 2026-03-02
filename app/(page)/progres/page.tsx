// app/progres/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";


export default async function ProgresPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-5">
            <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
              Progreso
            </h1>
            <p className="mt-1 text-sm text-neutral-600">Debes iniciar sesión.</p>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 py-8">
          <Link
            href="/login"
            className="inline-flex rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
          >
            Ir a login
          </Link>
        </section>
      </main>
    );
  }

  // Traemos ejercicios del usuario + entries (para calcular stats)
  const exercises = await prisma.exercise.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      category: true,
      catalogId: true,
      entries: {
        select: { date: true, weightKg: true, reps: true, sets: true },
        orderBy: { date: "desc" },
      },
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  // Agrupar por categoría (category puede ser null en tu schema)
  const byCategory = new Map<string, typeof exercises>();
  for (const ex of exercises) {
    const cat = ex.category ?? "Sin categoría";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(ex);
  }

  const categories = Array.from(byCategory.keys()).sort((a, b) =>
    a.localeCompare(b, "es")
  );

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
                Progreso
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                Ejercicios guardados agrupados por categoría.
              </p>
            </div>

            <Link
              href="/home"
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
            >
              ← Volver a home
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">
        {exercises.length === 0 ? (
          <div className="rounded-2xl border bg-white p-5 text-sm text-neutral-700 shadow-sm">
            Aún no tienes registros. Ve a <b>Ejercicios</b> y guarda tu primer set.
          </div>
        ) : (
          <div className="grid gap-5">
            {categories.map((cat) => {
              const list = byCategory.get(cat)!;

              return (
                <div key={cat} className="rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-neutral-900">{cat}</h2>
                    <span className="text-xs font-semibold text-neutral-500">
                      {list.length} ejercicio{list.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {list.map((ex) => {
                      const entries = ex.entries;
                      const last = entries[0];

                      // stats
                      const bestWeight =
                        entries.length > 0
                          ? Math.max(...entries.map((e) => e.weightKg))
                          : null;

                      const total = entries.length;

                      const lastDate = last
                        ? new Date(last.date).toLocaleDateString("es-CL")
                        : "-";

                      return (
                        <div
                          key={ex.id}
                          className="rounded-xl border bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-extrabold text-neutral-900">
                                {ex.name}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-neutral-500">
                                catalogId: {ex.catalogId}
                              </p>
                            </div>

                            <Link
                              href={`/entries/${ex.id}?catalogId=${ex.catalogId}&name=${encodeURIComponent(
                                ex.name
                              )}&cat=${encodeURIComponent(ex.category ?? "Sin categoría")}`}
                              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800"
                            >
                              + Registrar
                            </Link>
                            <Link
                                href={`/progres/ejercicio/${ex.id}`}
                                className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
                                >
                                Ver registros
                                </Link>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="rounded-lg border bg-neutral-50 p-2">
                              <p className="text-[11px] font-semibold text-neutral-500">
                                Última vez
                              </p>
                              <p className="text-sm font-extrabold text-neutral-900">
                                {lastDate}
                              </p>
                            </div>

                            <div className="rounded-lg border bg-neutral-50 p-2">
                              <p className="text-[11px] font-semibold text-neutral-500">
                                Mejor peso
                              </p>
                              <p className="text-sm font-extrabold text-neutral-900">
                                {bestWeight != null ? `${bestWeight} kg` : "-"}
                              </p>
                            </div>

                            <div className="rounded-lg border bg-neutral-50 p-2">
                              <p className="text-[11px] font-semibold text-neutral-500">
                                Registros
                              </p>
                              <p className="text-sm font-extrabold text-neutral-900">
                                {total}
                              </p>
                            </div>
                          </div>

                          {last && (
                            <p className="mt-3 text-xs font-semibold text-neutral-600">
                              Último: {last.weightKg} kg · {last.reps} reps · {last.sets} sets
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}