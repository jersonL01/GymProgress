"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Exercise = { id: string; name: string };

const MOCK_EXERCISES: Exercise[] = [
  // PECHO
  { id: "pecho-press-banca", name: "Press banca (barra)" },
  { id: "pecho-press-mancuernas", name: "Press banca con mancuernas" },
  { id: "pecho-press-inclinado-barra", name: "Press inclinado (barra)" },
  { id: "pecho-press-inclinado-mancuernas", name: "Press inclinado (mancuernas)" },
  { id: "pecho-press-declinado", name: "Press declinado" },
  { id: "pecho-fondos", name: "Fondos en paralelas (pecho)" },
  { id: "pecho-aperturas-planas", name: "Aperturas con mancuernas (plano)" },
  { id: "pecho-aperturas-inclinadas", name: "Aperturas con mancuernas (inclinado)" },
  { id: "pecho-pec-deck", name: "Pec deck (contractora)" },
  { id: "pecho-cruces-polea", name: "Cruces en polea" },
  { id: "pecho-flexiones", name: "Flexiones" },

  // ESPALDA
  { id: "espalda-dominadas", name: "Dominadas" },
  { id: "espalda-jalon-pecho", name: "Jalón al pecho" },
  { id: "espalda-jalon-trasnuca", name: "Jalón tras nuca" },
  { id: "espalda-remo-barra", name: "Remo con barra" },
  { id: "espalda-remo-mancuerna", name: "Remo con mancuerna a una mano" },
  { id: "espalda-remo-polea", name: "Remo en polea (sentado)" },
  { id: "espalda-remo-tbar", name: "Remo T-Bar" },
  { id: "espalda-pullover-polea", name: "Pullover en polea" },
  { id: "espalda-peso-muerto", name: "Peso muerto" },
  { id: "espalda-hiperextensiones", name: "Hiperextensiones (lumbar)" },
  { id: "espalda-face-pull", name: "Face pull" },

  // PIERNAS (CUÁDRICEPS / ISQUIS / GENERAL)
  { id: "piernas-sentadilla", name: "Sentadilla (barra)" },
  { id: "piernas-sentadilla-frontal", name: "Sentadilla frontal" },
  { id: "piernas-sentadilla-hack", name: "Sentadilla hack" },
  { id: "piernas-prensa", name: "Prensa de piernas" },
  { id: "piernas-zancadas", name: "Zancadas" },
  { id: "piernas-zancadas-caminando", name: "Zancadas caminando" },
  { id: "piernas-bulgaras", name: "Sentadilla búlgara" },
  { id: "piernas-extensiones", name: "Extensiones de cuádriceps" },
  { id: "piernas-curl-femoral", name: "Curl femoral" },
  { id: "piernas-curl-femoral-sentado", name: "Curl femoral sentado" },
  { id: "piernas-peso-muerto-rumano", name: "Peso muerto rumano" },
  { id: "piernas-buenos-dias", name: "Buenos días" },

  // GLÚTEOS
  { id: "gluteos-hip-thrust", name: "Hip thrust" },
  { id: "gluteos-puente-gluteo", name: "Puente de glúteo" },
  { id: "gluteos-patada-gluteo", name: "Patada de glúteo en polea" },
  { id: "gluteos-abducciones", name: "Abducciones (máquina)" },
  { id: "gluteos-sumo-deadlift", name: "Peso muerto sumo" },
  { id: "gluteos-step-ups", name: "Step-ups" },

  // HOMBROS
  { id: "hombros-press-militar", name: "Press militar (barra)" },
  { id: "hombros-press-mancuernas", name: "Press hombro (mancuernas)" },
  { id: "hombros-elevaciones-laterales", name: "Elevaciones laterales" },
  { id: "hombros-elevaciones-frontales", name: "Elevaciones frontales" },
  { id: "hombros-pajaro", name: "Pájaros (posterior) / Reverse fly" },
  { id: "hombros-remo-menton", name: "Remo al mentón" },
  { id: "hombros-arnold-press", name: "Arnold press" },

  // BÍCEPS
  { id: "biceps-curl-barra", name: "Curl con barra" },
  { id: "biceps-curl-mancuernas", name: "Curl con mancuernas" },
  { id: "biceps-curl-martillo", name: "Curl martillo" },
  { id: "biceps-curl-inclinado", name: "Curl inclinado (mancuernas)" },
  { id: "biceps-curl-predicador", name: "Curl predicador" },
  { id: "biceps-curl-polea", name: "Curl en polea" },

  // TRÍCEPS
  { id: "triceps-fondos", name: "Fondos (tríceps)" },
  { id: "triceps-press-frances", name: "Press francés" },
  { id: "triceps-extension-polea", name: "Extensión en polea (pushdown)" },
  { id: "triceps-extension-cuerda", name: "Extensión en polea con cuerda" },
  { id: "triceps-copa", name: "Extensión por encima (copa) con mancuerna" },
  { id: "triceps-press-cerrado", name: "Press banca cerrado" },

  // CORE (ABDOMEN / LUMBAR)
  { id: "core-plancha", name: "Plancha" },
  { id: "core-crunch", name: "Crunch" },
  { id: "core-elevacion-piernas", name: "Elevación de piernas" },
  { id: "core-crunch-cable", name: "Crunch en polea" },
  { id: "core-rueda-abdominal", name: "Rueda abdominal" },
  { id: "core-russian-twist", name: "Russian twist" },

  // PANTORRILLAS
  { id: "pantorrillas-elevacion-parado", name: "Elevación de pantorrillas de pie" },
  { id: "pantorrillas-elevacion-sentado", name: "Elevación de pantorrillas sentado" },
  { id: "pantorrillas-prensa", name: "Pantorrillas en prensa" },

  // TRAPECIO / CUELLO (opcional)
  { id: "trapecio-encogimientos", name: "Encogimientos (shrugs)" },
  { id: "trapecio-remo-vertical", name: "Remo vertical (trapecio)" },
];

export default function ExercisesList() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return MOCK_EXERCISES;
    return MOCK_EXERCISES.filter((e) => e.name.toLowerCase().includes(query));
  }, [q]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900">
            Lista de ejercicios
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Busca y selecciona uno.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
  <Link
    href="/"
    className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50"
  >
    ← Inicio
  </Link>

  <button
    type="button"
    className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
    onClick={() => alert("Luego lo conectamos para crear ejercicios 😉")}
  >
    + Nuevo
  </button>
</div>
      </div>

      <div className="mt-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar ejercicio…"
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {filtered.map((e) => (
          <Link
            key={e.id}
            href={`/entries/${e.id}`}
            className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50"
          >
            {e.name}
            <span className="ml-2 text-xs font-semibold text-neutral-500">
              Registrar →
            </span>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
            No se encontraron ejercicios.
          </div>
        )}
      </div>
    </div>
  );
}