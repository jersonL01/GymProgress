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
      if (redirectTo) router.push(redirectTo);
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
        "rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm",
        "hover:bg-red-700 disabled:opacity-60",
        className,
      ].join(" ")}
    >
      {loading ? "Eliminando..." : label}
    </button>
  );
}