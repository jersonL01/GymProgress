import Link from "next/link";
import { Plus } from "lucide-react";

type Props = {
    sessionId: string;
};

export default function AddWorkoutExerciseButton({ sessionId }: Props) {
    return (
        <Link
            href={`/entreno/agregar-ejercicio?sessionId=${sessionId}`}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand hover:bg-brand-hover px-4 py-4 text-[17px] font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all active:scale-[0.98]"
        >
            <Plus size={22} className="stroke-[2.5]" />
            <span>Agregar ejercicio</span>
        </Link>
    );
}