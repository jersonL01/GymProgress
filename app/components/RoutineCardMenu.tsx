"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/app/components/ConfirmDialog";

type Props = {
    routineId: string;
    routineName: string;
    dayLabel?: string;
    exercisesText: string;
};

export default function RoutineCardMenu({
    routineId,
    routineName,
    dayLabel,
    exercisesText,
}: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function handleDelete() {
        try {
            setLoadingDelete(true);

            const response = await fetch(`/api/routines/${routineId}`, {
                method: "DELETE",
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.error || "No se pudo borrar la rutina");
            }

            setConfirmDeleteOpen(false);
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo borrar la rutina"
            );
        } finally {
            setLoadingDelete(false);
        }
    }

    async function handleCopy() {
        try {
            const text = [
                `Rutina: ${routineName}`,
                dayLabel ? `Día: ${dayLabel}` : null,
                "",
                "Ejercicios:",
                exercisesText
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .map((item, index) => `${index + 1}. ${item}`)
                    .join("\n"),
            ]
                .filter(Boolean)
                .join("\n");

            await navigator.clipboard.writeText(text);
            setOpen(false);
            alert("Rutina copiada");
        } catch (error) {
            console.error(error);
            alert("No se pudo copiar la rutina");
        }
    }

    function handleEdit() {
        setOpen(false);
        router.push(`/rutinas/${routineId}`);
    }

    return (
        <>
            <div ref={containerRef} className="relative shrink-0">
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-2xl leading-none text-white/80 transition hover:bg-white/10"
                >
                    •••
                </button>

                {open ? (
                    <div className="absolute right-0 top-12 z-50 min-w-[220px] overflow-hidden rounded-2xl border border-white/10 bg-[#16181F] shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
                        <button
                            onClick={handleEdit}
                            className="w-full border-b border-white/5 px-4 py-3 text-left text-sm text-white transition hover:bg-white/5"
                        >
                            Editar entrenamiento
                        </button>

                        <button
                            onClick={handleCopy}
                            className="w-full border-b border-white/5 px-4 py-3 text-left text-sm text-white transition hover:bg-white/5"
                        >
                            Copiar entrenamiento
                        </button>

                        <button
                            onClick={() => {
                                setOpen(false);
                                setConfirmDeleteOpen(true);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                        >
                            Borrar entrenamiento
                        </button>
                    </div>
                ) : null}
            </div>

            <ConfirmDialog
                open={confirmDeleteOpen}
                title="Borrar entrenamiento"
                description="Esta acción eliminará la rutina guardada. No se puede deshacer."
                confirmText="Borrar"
                cancelText="Cancelar"
                destructive
                loading={loadingDelete}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDeleteOpen(false)}
            />
        </>
    );
}