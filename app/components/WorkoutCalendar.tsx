type WorkoutCalendarProps = {
    completedDates: string[];
};

function sameDay(date: Date, isoDate: string) {
    const d = new Date(isoDate);
    return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
}

export default function WorkoutCalendar({
    completedDates,
}: WorkoutCalendarProps) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startWeekday = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: Array<Date | null> = [];

    for (let i = 0; i < startWeekday; i++) {
        days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
        days.push(new Date(year, month, day));
    }

    const monthLabel = now.toLocaleDateString("es-CL", {
        month: "long",
        year: "numeric",
    });

    const weekdayLabels = ["D", "L", "M", "M", "J", "V", "S"];

    return (
        <div className="rounded-[32px] border border-border-strong bg-surface-100 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight text-white">Calendario</h2>
                <span className="text-sm font-semibold uppercase tracking-wider text-text-muted">{monthLabel}</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {weekdayLabels.map((label, index) => (
                    <div
                        key={`${label}-${index}`}
                        className="text-center text-[10px] font-bold uppercase tracking-wider text-text-dim mb-2"
                    >
                        {label}
                    </div>
                ))}

                {days.map((day, index) => {
                    if (!day) {
                        return <div key={`empty-${index}`} className="h-10 w-full" />;
                    }

                    const completed = completedDates.some((isoDate) =>
                        sameDay(day, isoDate)
                    );

                    const isToday =
                        day.getDate() === now.getDate() &&
                        day.getMonth() === now.getMonth() &&
                        day.getFullYear() === now.getFullYear();

                    return (
                        <div
                            key={day.toISOString()}
                            className={`flex h-10 w-full items-center justify-center rounded-xl text-sm font-bold transition-all ${
                                completed
                                    ? "bg-accent/20 text-accent ring-1 ring-accent/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                                    : "bg-surface-200 text-text-muted hover:bg-surface-300"
                                } ${isToday && !completed ? "ring-2 ring-brand text-white" : ""} ${isToday && completed ? "ring-2 ring-brand" : ""}`}
                        >
                            {day.getDate()}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex items-center gap-6 text-[11px] font-semibold uppercase tracking-wider text-text-muted justify-center bg-surface-200/50 py-3 rounded-2xl">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span>Entrenado</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-surface-300 border border-border-subtle" />
                    <span>Sin Entreno</span>
                </div>
            </div>
        </div>
    );
}