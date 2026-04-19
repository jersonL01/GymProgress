"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    sessionId: string;
};

export default function FinishWorkoutActions({ sessionId }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<"session" | "routine" | null>(null);

    async function finish(updateRoutine: boolean) {
        try {
            setLoading(updateRoutine ? "routine" : "session");

            const response = await fetch(`/api/workout-sessions/${sessionId}/finish`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ updateRoutine }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.error || "No se pudo finalizar el entreno");
            }

            router.push("/home");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo finalizar el entreno"
            );
        } finally {
            setLoading(null);
            setOpen(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="rounded-[16px] bg-[#1693FF] px-5 py-3 text-[17px] font-medium text-white"
            >
                Terminar
            </button>

            {open ? (
                <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm">
                    <div className="w-full rounded-t-[30px] bg-[#121319] p-5">
                        <h3 className="text-xl font-semibold text-white">
                            Finalizar entreno
                        </h3>

                        <p className="mt-2 text-sm text-white/50">
                            Elige qué hacer con los cambios de esta sesión.
                        </p>

                        <div className="mt-5 space-y-3">
                            <button
                                onClick={() => finish(false)}
                                disabled={loading !== null}
                                className="w-full rounded-[18px] bg-white/10 px-4 py-4 text-left text-white disabled:opacity-60"
                            >
                                <div className="font-medium">Guardar solo entreno</div>
                                <div className="mt-1 text-sm text-white/50">
                                    Guarda esta sesión sin modificar la rutina base.
                                </div>
                            </button>

                            <button
                                onClick={() => finish(true)}
                                disabled={loading !== null}
                                className="w-full rounded-[18px] bg-[#1693FF] px-4 py-4 text-left text-white disabled:opacity-60"
                            >
                                <div className="font-medium">Guardar y actualizar rutina</div>
                                <div className="mt-1 text-sm text-white/80">
                                    Guarda esta sesión y actualiza la rutina con los cambios.
                                </div>
                            </button>

                            <button
                                onClick={() => setOpen(false)}
                                disabled={loading !== null}
                                className="w-full rounded-[18px] bg-transparent px-4 py-4 text-white/60"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}