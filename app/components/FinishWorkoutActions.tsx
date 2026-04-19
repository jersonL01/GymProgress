"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    sessionId: string;
};

export default function FinishWorkoutActions({ sessionId }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState<"session" | "routine" | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open, mounted]);

    async function finish(updateRoutine: boolean) {
        try {
            setLoading(updateRoutine ? "routine" : "session");

            const response = await fetch(`/api/workout-sessions/${sessionId}/finish`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    updateRoutine,
                }),
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

    const modal =
        open && mounted
            ? createPortal(
                <div className="fixed inset-0 z-[99999]">
                    <button
                        type="button"
                        aria-label="Cerrar modal"
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full max-w-[380px] rounded-[28px] border border-white/10 bg-[#121319] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                            <div className="mb-4">
                                <h3 className="text-[22px] font-semibold text-white">
                                    Finalizar entreno
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-white/50">
                                    Elige qué quieres hacer con los cambios de esta sesión.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => finish(false)}
                                    disabled={loading !== null}
                                    className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:bg-white/10 disabled:opacity-60"
                                >
                                    <div className="text-[16px] font-medium text-white">
                                        Guardar solo entreno
                                    </div>
                                    <div className="mt-1 text-sm text-white/50">
                                        Guarda esta sesión sin modificar la rutina base.
                                    </div>
                                </button>

                                <button
                                    onClick={() => finish(true)}
                                    disabled={loading !== null}
                                    className="w-full rounded-[20px] bg-[#1693FF] px-4 py-4 text-left text-white shadow-[0_10px_24px_rgba(22,147,255,0.28)] transition hover:brightness-110 disabled:opacity-60"
                                >
                                    <div className="text-[16px] font-medium">
                                        Guardar y actualizar rutina
                                    </div>
                                    <div className="mt-1 text-sm text-white/80">
                                        Guarda esta sesión y actualiza la rutina con estos cambios.
                                    </div>
                                </button>

                                <button
                                    onClick={() => setOpen(false)}
                                    disabled={loading !== null}
                                    className="w-full rounded-[20px] border border-white/10 bg-transparent px-4 py-3 text-center text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-60"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )
            : null;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="rounded-[18px] bg-[#1693FF] px-5 py-3 text-[17px] font-medium text-white shadow-[0_10px_24px_rgba(22,147,255,0.28)] transition active:scale-[0.98]"
            >
                Terminar
            </button>

            {modal}
        </>
    );
}