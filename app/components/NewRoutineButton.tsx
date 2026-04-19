"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function NewRoutineButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreateRoutine() {
    try {
      setLoading(true);

      const response = await fetch("/api/routines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Nueva rutina",
          dayLabel: "Sin día",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.id) {
        throw new Error(data?.error || "No se pudo crear la rutina");
      }

      router.push(`/rutinas/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear la rutina");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCreateRoutine}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand hover:bg-brand-hover px-5 py-4 text-[17px] font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all active:scale-[0.98] disabled:opacity-60"
    >
      <Plus size={22} className="stroke-[2.5]" />
      <span>{loading ? "Creando..." : "Nueva rutina"}</span>
    </button>
  );
}