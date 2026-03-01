import Link from "next/link";

export default function HomeActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/progress"
        className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Ver progreso
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Revisa tu evolución por ejercicio y tu 1RM estimado.
            </p>
          </div>

          <span className="rounded-full border px-3 py-1 text-xs font-semibold text-neutral-700 transition group-hover:bg-neutral-100">
            Abrir →
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-neutral-50 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-neutral-500">Último registro</p>
              <p className="text-lg font-extrabold text-neutral-900">
                80 kg
                <span className="ml-2 text-xs font-semibold text-neutral-500">
                  x 8
                </span>
              </p>
            </div>
            <p className="text-xs font-semibold text-neutral-500">
              Ej: Press banca
            </p>
          </div>
        </div>
      </Link>

      <Link
        href="/entries"
        className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Registrar entrenamiento
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Agrega peso, reps y series en segundos.
            </p>
          </div>

          <span className="rounded-full border px-3 py-1 text-xs font-semibold text-neutral-700 transition group-hover:bg-neutral-100">
            Nuevo →
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-neutral-50 p-4 text-center">
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs text-neutral-500">Peso</p>
            <p className="text-sm font-extrabold text-neutral-900">kg</p>
          </div>
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs text-neutral-500">Reps</p>
            <p className="text-sm font-extrabold text-neutral-900">x</p>
          </div>
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs text-neutral-500">Series</p>
            <p className="text-sm font-extrabold text-neutral-900">#</p>
          </div>
        </div>
      </Link>
    </div>
  );
}