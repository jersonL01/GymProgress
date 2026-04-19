"use client";

type Props = {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    destructive = false,
    loading = false,
    onConfirm,
    onCancel,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <button
                type="button"
                aria-label="Cerrar"
                onClick={onCancel}
                className="absolute inset-0"
            />

            <div className="relative w-full max-w-[360px] rounded-[28px] border border-white/10 bg-[#121319] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                <h3 className="text-[22px] font-semibold text-white">{title}</h3>

                {description ? (
                    <p className="mt-2 text-sm leading-6 text-white/50">{description}</p>
                ) : null}

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-60"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-[18px] px-4 py-3 text-sm font-medium text-white transition disabled:opacity-60 ${destructive
                                ? "bg-red-500 hover:bg-red-400"
                                : "bg-[#1693FF] hover:brightness-110"
                            }`}
                    >
                        {loading ? "Procesando..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}