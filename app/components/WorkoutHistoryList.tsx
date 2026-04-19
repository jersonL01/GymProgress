type WorkoutHistoryItem = {
    id: string;
    routineName: string;
    startedAt: string;
    durationSec: number;
    totalSets: number;
    completedSets: number;
    totalVolume: number;
};

type WorkoutHistoryListProps = {
    items: WorkoutHistoryItem[];
};

function formatDuration(durationSec: number) {
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    return `${mins}m ${secs}s`;
}

function formatDate(dateIso: string) {
    const d = new Date(dateIso);
    return d.toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
    });
}

export default function WorkoutHistoryList({
    items,
}: WorkoutHistoryListProps) {
    return (
        <div className="rounded-[32px] border border-border-strong bg-surface-100 p-6 shadow-2xl">
            <div className="mb-6">
                <h2 className="text-lg font-bold tracking-tight text-white mb-1">Historial reciente</h2>
                <p className="text-sm font-medium text-text-muted">
                    Tus últimos entrenamientos terminados
                </p>
            </div>

            <div className="space-y-4">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-3xl border border-border-subtle bg-surface-200 p-5 shadow-inner transition-colors hover:bg-surface-300 group"
                        >
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-[17px] font-bold text-brand-light group-hover:text-brand transition-colors">
                                        {item.routineName}
                                    </h3>
                                    <p className="mt-1 flex items-center gap-2 text-[13px] font-medium text-text-muted">
                                        <span className="w-1.5 h-1.5 rounded-full bg-text-dim"></span>
                                        {formatDate(item.startedAt)}
                                        <span className="w-1.5 h-1.5 rounded-full bg-text-dim ml-1"></span>
                                        {formatDuration(item.durationSec)}
                                    </p>
                                </div>

                                <div className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold tracking-wide text-accent ring-1 ring-accent/20">
                                    {item.completedSets}/{item.totalSets} sets
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex flex-col rounded-2xl bg-surface-100/50 p-4 border border-border-subtle">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim mb-1">Volumen</span>
                                    <span className="text-base font-bold text-white">{item.totalVolume} <span className="text-[11px] text-text-muted">KG</span></span>
                                </div>

                                <div className="flex flex-col rounded-2xl bg-surface-100/50 p-4 border border-border-subtle">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim mb-1">Cumplimiento</span>
                                    <span className="text-base font-bold text-white">
                                        {item.totalSets > 0
                                            ? `${Math.round((item.completedSets / item.totalSets) * 100)}%`
                                            : "0%"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center rounded-3xl bg-surface-50 border border-border-subtle border-dashed p-10 text-sm font-medium text-text-muted italic">
                        Aún no tienes entrenamientos terminados.
                    </div>
                )}
            </div>
        </div>
    );
}