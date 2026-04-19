import StartRoutineButton from "@/app/components/StartRoutineButton";
import RoutineCardMenu from "@/app/components/RoutineCardMenu";

type RoutineCardProps = {
    id: string;
    day: string;
    exercises: string;
    dayLabel?: string;
};

export default function RoutineCard({
    id,
    day,
    exercises,
    dayLabel,
}: RoutineCardProps) {
    return (
        <article className="rounded-[28px] border border-white/5 bg-[#15161B] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-2xl font-semibold text-white">{day}</h2>

                    {dayLabel ? (
                        <p className="mt-1 text-sm text-[#1693FF]">{dayLabel}</p>
                    ) : null}

                    <p className="mt-2 line-clamp-2 text-[15px] leading-7 text-white/45">
                        {exercises}
                    </p>
                </div>

                <RoutineCardMenu
                    routineId={id}
                    routineName={day}
                    dayLabel={dayLabel}
                    exercisesText={exercises}
                />
            </div>

            <div className="mt-6">
                <StartRoutineButton routineId={id} />
            </div>
        </article>
    );
}