import Link from "next/link";

export default function HomeActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/progres"
        className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl border border-white/10 bg-black/20 p-2">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-blue-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="M7 15l3-3 3 2 5-6" />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-extrabold text-white">
                Ver progreso
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Revisa tu evolución por ejercicio y tu 1RM estimado.
              </p>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition group-hover:bg-white/10">
            Abrir →
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-white/50">Último registro</p>
              <p className="text-lg font-extrabold text-white">
                80 kg
                <span className="ml-2 text-xs font-semibold text-white/50">
                  x 8
                </span>
              </p>
            </div>
            <p className="text-xs font-semibold text-white/50">
              Ej: Press banca
            </p>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[62%] rounded-full bg-blue-500/70" />
          </div>
        </div>
      </Link>

      <Link
        href="/ejercicio"
        className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl border border-white/10 bg-black/20 p-2">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-blue-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-extrabold text-white">
                Registrar entrenamiento
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Agrega peso, reps y series en segundos.
              </p>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition group-hover:bg-white/10">
            Nuevo →
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-black/20 p-4 text-center">
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-white/50">Peso</p>
            <p className="text-sm font-extrabold text-white">kg</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-white/50">Reps</p>
            <p className="text-sm font-extrabold text-white">x</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-white/50">Series</p>
            <p className="text-sm font-extrabold text-white">#</p>
          </div>
        </div>
      </Link>
    </div>
  );
}