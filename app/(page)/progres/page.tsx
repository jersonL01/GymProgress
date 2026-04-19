// app/progres/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export default async function ProgresPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  // UI wrappers (mismo estilo que login/home)
  const PageShell = ({ children }: { children: React.ReactNode }) => (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0F14] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.10),transparent_40%)]" />
      </div>
      <div className="relative">{children}</div>
    </main>
  );

  if (!userId) {
    return (
      <PageShell>
        <header className="border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4 py-5">
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Progreso
            </h1>
            <p className="mt-1 text-sm text-white/70">Debes iniciar sesión.</p>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 py-8">
          <Link
            href="/login"
            className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(37,99,235,0.35)] transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
          >
            Ir a login
          </Link>
        </section>
      </PageShell>
    );
  }

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
    <PageShell>
      <header className="border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" />
                Progreso
              </div>

              <h1 className="mt-3 text-xl font-extrabold tracking-tight sm:text-2xl">
                Ejercicios guardados
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Agrupados por categoría. Entra a registrar o revisar historial.
              </p>
            </div>

            <Link
              href="/home"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              ← Volver a home
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">
        {exercises.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-sm text-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            Aún no tienes registros. Ve a <b>Ejercicios</b> y guarda tu primer set.
          </div>
        ) : (
          <div className="grid gap-5">
            {categories.map((cat) => {
              const list = byCategory.get(cat)!;

              return (
                <div
                  key={cat}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-extrabold text-white">{cat}</h2>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/60">
                      {list.length} ejercicio{list.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {list.map((ex) => {
                      const entries = ex.entries;
                      const last = entries[0];

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
                          className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.05]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-extrabold text-white">
                                {ex.name}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-white/50">
                              </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">

                              <Link
                                href={`/progres/ejercicio/${ex.id}`}
                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                              >
                                Ver registros
                              </Link>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2">
                              <p className="text-[11px] font-semibold text-white/50">
                                Última vez
                              </p>
                              <p className="text-sm font-extrabold text-white">
                                {lastDate}
                              </p>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2">
                              <p className="text-[11px] font-semibold text-white/50">
                                Mejor peso
                              </p>
                              <p className="text-sm font-extrabold text-white">
                                {bestWeight != null ? `${bestWeight} kg` : "-"}
                              </p>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2">
                              <p className="text-[11px] font-semibold text-white/50">
                                Registros
                              </p>
                              <p className="text-sm font-extrabold text-white">
                                {total}
                              </p>
                            </div>
                          </div>

                          {last && (
                            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                              <p className="text-xs font-semibold text-white/60">
                                Último
                              </p>
                              <p className="mt-1 text-xs font-semibold text-white/80">
                                <span className="inline-flex items-center rounded-full border border-white/10 bg-blue-500/15 px-2 py-0.5 text-[11px] font-bold text-blue-200">
                                  {last.weightKg} kg
                                </span>
                                <span className="mx-2 text-white/40">·</span>
                                {last.reps} reps
                                <span className="mx-2 text-white/40">·</span>
                                {last.sets} sets
                              </p>
                            </div>
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
    </PageShell>
  );
}