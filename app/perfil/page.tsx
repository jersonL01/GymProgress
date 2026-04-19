import BottomNav from "@/app/components/BottomNav";
import WorkoutCalendar from "@/app/components/WorkoutCalendar";
import WorkoutHistoryList from "@/app/components/WorkoutHistoryList";
import { prisma } from "@/app/lib/prisma";

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default async function PerfilPage() {
    const user = await prisma.user.findFirst({
        include: {
            profile: true,
        },
        orderBy: { createdAt: "asc" },
    });

    const profile = user?.profile;

    let sessions: Array<{
        id: string;
        startedAt: Date;
        durationSec: number;
        exercises: Array<{
            nameSnapshot: string;
            sets: Array<{
                completed: boolean;
                actualKg: number | null;
                actualReps: number | null;
            }>;
        }>;
    }> = [];

    if (user) {
        sessions = await prisma.workoutSession.findMany({
            where: {
                userId: user.id,
                status: "completed",
            },
            orderBy: {
                startedAt: "desc",
            },
            take: 20,
            include: {
                exercises: {
                    include: {
                        sets: true,
                    },
                },
            },
        });
    }

    const monthStart = startOfMonth(new Date());

    const monthSessions = sessions.filter(
        (session) => session.startedAt >= monthStart
    );

    const completedDates = monthSessions.map((session) =>
        session.startedAt.toISOString()
    );

    const totalWorkoutsThisMonth = monthSessions.length;

    const totalDurationThisMonth = monthSessions.reduce(
        (acc, session) => acc + session.durationSec,
        0
    );

    const totalDurationMinutes = Math.floor(totalDurationThisMonth / 60);

    const historyItems = sessions.map((session) => {
        const routineName =
            session.exercises[0]?.nameSnapshot
                ? `Sesión ${session.exercises[0].nameSnapshot}`
                : "Entrenamiento";

        const totalSets = session.exercises.reduce(
            (acc, exercise) => acc + exercise.sets.length,
            0
        );

        const completedSets = session.exercises.reduce(
            (acc, exercise) =>
                acc + exercise.sets.filter((set) => set.completed).length,
            0
        );

        const totalVolume = session.exercises.reduce((acc, exercise) => {
            const exerciseVolume = exercise.sets.reduce((setAcc, set) => {
                return setAcc + (set.actualKg ?? 0) * (set.actualReps ?? 0);
            }, 0);

            return acc + exerciseVolume;
        }, 0);

        return {
            id: session.id,
            routineName,
            startedAt: session.startedAt.toISOString(),
            durationSec: session.durationSec,
            totalSets,
            completedSets,
            totalVolume,
        };
    });

    return (
        <main className="min-h-screen bg-bg-base text-white pb-28">
            <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg-app">
                <header className="sticky top-0 z-20 border-b border-border-subtle bg-bg-app/80 px-5 pb-4 pt-8 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-widest text-brand-light font-medium mb-1">
                        Área Personal
                    </p>
                    <h1 className="text-[32px] font-bold tracking-tight">Tu Perfil</h1>
                </header>

                <section className="flex-1 space-y-6 px-4 py-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-[24px] border border-border-strong bg-surface-100 p-5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-brand/10 rounded-full blur-2xl -z-10"></div>
                            <h2 className="text-sm font-semibold tracking-wide uppercase text-text-dim mb-4">Datos físicos</h2>
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted">Peso</span>
                                    <span className="text-[17px] font-bold text-white">{profile?.weightKg ?? "-"} kg</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted">Altura</span>
                                    <span className="text-[17px] font-bold text-white">{profile?.heightCm ?? "-"} cm</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted">Edad</span>
                                    <span className="text-[17px] font-bold text-white">{profile?.age ?? "-"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-border-strong bg-surface-100 p-5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-accent/10 rounded-full blur-2xl -z-10"></div>
                            <h2 className="text-sm font-semibold tracking-wide uppercase text-text-dim mb-4">Nutrición</h2>
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted">Calorías max</span>
                                    <span className="text-[17px] font-bold text-white">{profile?.caloriesTarget ?? "-"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted">Proteína meta</span>
                                    <span className="text-[17px] font-bold text-white">{profile?.proteinTarget ?? "-"} g</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted">Objetivo</span>
                                    <span className="text-[17px] font-bold text-brand-light capitalize">{profile?.goal ?? "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-border-strong bg-surface-100 p-6 shadow-2xl">
                        <h2 className="text-lg font-bold tracking-tight mb-4">Resumen del mes</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center justify-center rounded-[20px] bg-surface-200 p-5 border border-border-subtle shadow-inner">
                                <span className="text-[32px] font-bold text-brand-light leading-none">{totalWorkoutsThisMonth}</span>
                                <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-text-muted">Entrenos</span>
                            </div>

                            <div className="flex flex-col items-center justify-center rounded-[20px] bg-surface-200 p-5 border border-border-subtle shadow-inner">
                                <span className="text-[32px] font-bold text-accent leading-none">{totalDurationMinutes}</span>
                                <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-text-muted">Minutos</span>
                            </div>
                        </div>
                    </div>

                    <WorkoutCalendar completedDates={completedDates} />

                    <WorkoutHistoryList items={historyItems} />
                </section>

                <BottomNav />
            </div>
        </main>
    );
}