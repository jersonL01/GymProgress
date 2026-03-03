"use client";

import { useEffect } from "react";

type DeleteAlertProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
};

export default function DeleteAlert({
  open,
  title = "¿Eliminar?",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  loading = false,
  onConfirm,
  onClose,
}: DeleteAlertProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* click afuera */}
      <button
        aria-label="Cerrar"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.08] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-xl border border-red-500/30 bg-red-500/10 p-2">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-red-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 3.2h3.4L22 19H2L10.3 3.2z" />
            </svg>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-white">{title}</h3>
            <p className="mt-1 text-sm text-white/70">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-red-500/20"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-100/70 border-t-transparent" />
                Eliminando...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>

        <p className="mt-3 text-xs text-white/45">
          Tip: Presiona <b>ESC</b> para cerrar.
        </p>
      </div>
    </div>
  );
}