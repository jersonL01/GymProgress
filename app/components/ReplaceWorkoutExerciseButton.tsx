import Link from "next/link";

type Props = {
    sessionId: string;
    workoutExerciseId: string;
};

export default function ReplaceWorkoutExerciseButton({
    sessionId,
    workoutExerciseId,
}: Props) {
    return (
        <Link
            href={`/entreno/agregar-ejercicio?sessionId=${sessionId}&replaceWorkoutExerciseId=${workoutExerciseId}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition hover:bg-surface-300 hover:text-white"
            title="Cambiar ejercicio"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </Link>
    );
}