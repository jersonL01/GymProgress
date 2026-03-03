"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type BtnDeleteProps = {
  endpoint: string;
  label?: string;
  confirmText?: string;
  redirectTo?: string;
  onSuccess?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
};

export default function BtnDelete({
  endpoint,
  label = "Eliminar",
  confirmText = "¿Eliminar?",
  redirectTo,
  onSuccess,
  disabled,
  className = "",
}: BtnDeleteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading || disabled) return;
    if (!confirm(confirmText)) return;

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        alert(json?.error ?? "No se pudo eliminar");
        return;
      }

      if (onSuccess) await onSuccess();
      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200",
        "shadow-sm transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60",
        "focus:outline-none focus:ring-4 focus:ring-red-500/20",
        className,
      ].join(" ")}
    >
      {loading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-200/70 border-t-transparent" />
          Eliminando...
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-red-200/80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}