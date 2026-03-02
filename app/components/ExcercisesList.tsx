"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Category =
  | "Todos"
  | "Pecho"
  | "Espalda"
  | "Piernas"
  | "Glúteos"
  | "Hombros"
  | "Bíceps"
  | "Tríceps"
  | "Core"
  | "Pantorrillas"
  | "Trapecio";

type Exercise = {
  id: string;        // slug para la URL (ej: "piernas-sentadilla-hack")
  catalogId: number; // ESTE es el que se guarda en DB (Int)
  name: string;
  category: Exclude<Category, "Todos">;
};

const CATEGORIES: Category[] = [
  "Todos",
  "Pecho",
  "Espalda",
  "Piernas",
  "Glúteos",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Core",
  "Pantorrillas",
  "Trapecio",
];

const MOCK_EXERCISES: Exercise[] = [
  // PECHO
  { id: "pecho-press-banca", catalogId: 1, name: "Press banca (barra)", category: "Pecho" },
  { id: "pecho-press-mancuernas", catalogId: 2, name: "Press banca con mancuernas", category: "Pecho" },
  { id: "pecho-press-inclinado-barra", catalogId: 3, name: "Press inclinado (barra)", category: "Pecho" },
  { id: "pecho-press-inclinado-mancuernas", catalogId: 4, name: "Press inclinado (mancuernas)", category: "Pecho" },
  { id: "pecho-press-declinado", catalogId: 5, name: "Press declinado", category: "Pecho" },
  { id: "pecho-fondos", catalogId: 6, name: "Fondos en paralelas (pecho)", category: "Pecho" },
  { id: "pecho-aperturas-planas", catalogId: 7, name: "Aperturas con mancuernas (plano)", category: "Pecho" },
  { id: "pecho-aperturas-inclinadas", catalogId: 8, name: "Aperturas con mancuernas (inclinado)", category: "Pecho" },
  { id: "pecho-pec-deck", catalogId: 9, name: "Pec deck (contractora)", category: "Pecho" },
  { id: "pecho-cruces-polea", catalogId: 10, name: "Cruces en polea", category: "Pecho" },
  { id: "pecho-flexiones", catalogId: 11, name: "Flexiones", category: "Pecho" },

  // ESPALDA
  { id: "espalda-dominadas", catalogId: 12, name: "Dominadas", category: "Espalda" },
  { id: "espalda-jalon-pecho", catalogId: 13, name: "Jalón al pecho", category: "Espalda" },
  { id: "espalda-jalon-trasnuca", catalogId: 14, name: "Jalón tras nuca", category: "Espalda" },
  { id: "espalda-remo-barra", catalogId: 15, name: "Remo con barra", category: "Espalda" },
  { id: "espalda-remo-mancuerna", catalogId: 16, name: "Remo con mancuerna a una mano", category: "Espalda" },
  { id: "espalda-remo-polea", catalogId: 17, name: "Remo en polea (sentado)", category: "Espalda" },
  { id: "espalda-remo-tbar", catalogId: 18, name: "Remo T-Bar", category: "Espalda" },
  { id: "espalda-pullover-polea", catalogId: 19, name: "Pullover en polea", category: "Espalda" },
  { id: "espalda-peso-muerto", catalogId: 20, name: "Peso muerto", category: "Espalda" },
  { id: "espalda-hiperextensiones", catalogId: 21, name: "Hiperextensiones (lumbar)", category: "Espalda" },
  { id: "espalda-face-pull", catalogId: 22, name: "Face pull", category: "Espalda" },

  // PIERNAS
  { id: "piernas-sentadilla", catalogId: 23, name: "Sentadilla (barra)", category: "Piernas" },
  { id: "piernas-sentadilla-frontal", catalogId: 24, name: "Sentadilla frontal", category: "Piernas" },
  { id: "piernas-sentadilla-hack", catalogId: 25, name: "Sentadilla hack", category: "Piernas" },
  { id: "piernas-prensa", catalogId: 26, name: "Prensa de piernas", category: "Piernas" },
  { id: "piernas-zancadas", catalogId: 27, name: "Zancadas", category: "Piernas" },
  { id: "piernas-zancadas-caminando", catalogId: 28, name: "Zancadas caminando", category: "Piernas" },
  { id: "piernas-bulgaras", catalogId: 29, name: "Sentadilla búlgara", category: "Piernas" },
  { id: "piernas-extensiones", catalogId: 30, name: "Extensiones de cuádriceps", category: "Piernas" },
  { id: "piernas-curl-femoral", catalogId: 31, name: "Curl femoral", category: "Piernas" },
  { id: "piernas-curl-femoral-sentado", catalogId: 32, name: "Curl femoral sentado", category: "Piernas" },
  { id: "piernas-peso-muerto-rumano", catalogId: 33, name: "Peso muerto rumano", category: "Piernas" },
  { id: "piernas-buenos-dias", catalogId: 34, name: "Buenos días", category: "Piernas" },

  // GLÚTEOS
  { id: "gluteos-hip-thrust", catalogId: 35, name: "Hip thrust", category: "Glúteos" },
  { id: "gluteos-puente-gluteo", catalogId: 36, name: "Puente de glúteo", category: "Glúteos" },
  { id: "gluteos-patada-gluteo", catalogId: 37, name: "Patada de glúteo en polea", category: "Glúteos" },
  { id: "gluteos-abducciones", catalogId: 38, name: "Abducciones (máquina)", category: "Glúteos" },
  { id: "gluteos-sumo-deadlift", catalogId: 39, name: "Peso muerto sumo", category: "Glúteos" },
  { id: "gluteos-step-ups", catalogId: 40, name: "Step-ups", category: "Glúteos" },

  // HOMBROS
  { id: "hombros-press-militar", catalogId: 41, name: "Press militar (barra)", category: "Hombros" },
  { id: "hombros-press-mancuernas", catalogId: 42, name: "Press hombro (mancuernas)", category: "Hombros" },
  { id: "hombros-elevaciones-laterales", catalogId: 43, name: "Elevaciones laterales", category: "Hombros" },
  { id: "hombros-elevaciones-frontales", catalogId: 44, name: "Elevaciones frontales", category: "Hombros" },
  { id: "hombros-pajaro", catalogId: 45, name: "Pájaros (posterior) / Reverse fly", category: "Hombros" },
  { id: "hombros-remo-menton", catalogId: 46, name: "Remo al mentón", category: "Hombros" },
  { id: "hombros-arnold-press", catalogId: 47, name: "Arnold press", category: "Hombros" },

  // BÍCEPS
  { id: "biceps-curl-barra", catalogId: 48, name: "Curl con barra", category: "Bíceps" },
  { id: "biceps-curl-mancuernas", catalogId: 49, name: "Curl con mancuernas", category: "Bíceps" },
  { id: "biceps-curl-martillo", catalogId: 50, name: "Curl martillo", category: "Bíceps" },
  { id: "biceps-curl-inclinado", catalogId: 51, name: "Curl inclinado (mancuernas)", category: "Bíceps" },
  { id: "biceps-curl-predicador", catalogId: 52, name: "Curl predicador", category: "Bíceps" },
  { id: "biceps-curl-polea", catalogId: 53, name: "Curl en polea", category: "Bíceps" },

  // TRÍCEPS
  { id: "triceps-fondos", catalogId: 54, name: "Fondos (tríceps)", category: "Tríceps" },
  { id: "triceps-press-frances", catalogId: 55, name: "Press francés", category: "Tríceps" },
  { id: "triceps-extension-polea", catalogId: 56, name: "Extensión en polea (pushdown)", category: "Tríceps" },
  { id: "triceps-extension-cuerda", catalogId: 57, name: "Extensión en polea con cuerda", category: "Tríceps" },
  { id: "triceps-copa", catalogId: 58, name: "Extensión por encima (copa) con mancuerna", category: "Tríceps" },
  { id: "triceps-press-cerrado", catalogId: 59, name: "Press banca cerrado", category: "Tríceps" },

  // CORE
  { id: "core-plancha", catalogId: 60, name: "Plancha", category: "Core" },
  { id: "core-crunch", catalogId: 61, name: "Crunch", category: "Core" },
  { id: "core-elevacion-piernas", catalogId: 62, name: "Elevación de piernas", category: "Core" },
  { id: "core-crunch-cable", catalogId: 63, name: "Crunch en polea", category: "Core" },
  { id: "core-rueda-abdominal", catalogId: 64, name: "Rueda abdominal", category: "Core" },
  { id: "core-russian-twist", catalogId: 65, name: "Russian twist", category: "Core" },

  // PANTORRILLAS
  { id: "pantorrillas-elevacion-parado", catalogId: 66, name: "Elevación de pantorrillas de pie", category: "Pantorrillas" },
  { id: "pantorrillas-elevacion-sentado", catalogId: 67, name: "Elevación de pantorrillas sentado", category: "Pantorrillas" },
  { id: "pantorrillas-prensa", catalogId: 68, name: "Pantorrillas en prensa", category: "Pantorrillas" },

  // TRAPECIO
  { id: "trapecio-encogimientos", catalogId: 69, name: "Encogimientos (shrugs)", category: "Trapecio" },
  { id: "trapecio-remo-vertical", catalogId: 70, name: "Remo vertical (trapecio)", category: "Trapecio" },
];

export default function ExercisesList() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category>("Todos");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = MOCK_EXERCISES;

    if (category !== "Todos") list = list.filter((e) => e.category === category);
    if (query) list = list.filter((e) => e.name.toLowerCase().includes(query));

    return list;
  }, [q, category]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Ejercicios</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Elige una categoría y selecciona un ejercicio.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href="/home"
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

      {/* Filtros */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-neutral-700">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Buscar</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar ejercicio…"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {filtered.map((e) => (
          <Link
            key={e.id}
            href={`/entries/${e.id}?catalogId=${e.catalogId}&name=${encodeURIComponent(
              e.name
            )}&cat=${encodeURIComponent(e.category)}`}
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