import ExercisesList from "@/app/components/ExercisesList"; 
import AppHeader from "@/app/components/AppHeader";

export default function EntriesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0F14] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.10),transparent_40%)]" />
      </div>

      <div className="relative">
        {/* Header consistente */}
        <AppHeader />

        {/* Title section */}
        <header className="border-b border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" />
              Ejercicios
            </div>

            <h1 className="mt-3 text-xl font-extrabold tracking-tight sm:text-2xl">
              Selecciona un ejercicio
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Elige un ejercicio para registrar tu entrenamiento.
            </p>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 py-8">
          <ExercisesList />
        </section>
      </div>
    </main>
  );
}